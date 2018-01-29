/* eslint "no-var":off, "ember-suave/prefer-destructuring":off */

var mergeTrees = require('broccoli-merge-trees')
var d3DepsForPackage = require('./lib/d3-deps-for-package')
var path = require('path')
var Funnel = require('broccoli-funnel')
var rollupExternalPackage = require('./lib/rollup-external-package')
var inclusionFilter = require('./lib/inclusion-filter')
var exclusionFilter = require('./lib/exclusion-filter')

module.exports = {
	isDevelopingAddon() {
		return false
	},

	name: 'ember-d3',

	_getAllD3Modules() {
		let nodeModulesPath = require('resolve').sync('d3', {
			basedir: this.project.root,
		})

		return d3DepsForPackage('d3', nodeModulesPath, this.ui)
	},

	getD3Modules(config) {
		var allModules = this._getAllD3Modules()
		var onlyModules = config.only || []
		var exceptModules = config.except || []

		return allModules.filter(inclusionFilter(onlyModules)).filter(exclusionFilter(exceptModules))
	},

	included(app) {
		this._super.included.apply(this, arguments)

		if (!this.import) {
			if (this.isDevelopingAddon()) {
				this.ui.writeWarnLine('[ember-d3] skipping included hook for', this.name)
			}

			return
		}

		let config = app.project.config(app.env) || {}
		this.addonConfig = config[this.name] || {}

		let plugins = this.addonConfig.plugins || []

		// let d3Modules = this._getAllD3Modules();
		this.d3Modules = this.getD3Modules(this.addonConfig)

		plugins.forEach(pluginName => {
			this.d3Modules.push({ name: pluginName })
		})

		// Import each D3 module
		this.d3Modules.forEach(module => {
			this.import(path.posix.join('vendor', `${module.name}.js`))
		})

		if (!this.addonConfig.only && !this.addonConfig.except) {
			// Import D3 include for bundled imports
			this.import(path.posix.join('vendor', 'd3.js'))
		}
	},

	treeForApp(_tree) {
		if (this._hasOnlyOrExceptConfig()) {
			var tree = new Funnel(_tree, {
				exclude: ['app/initializers/register-d3-version.js'],
			})
			this._super.treeForApp.call(this, tree)
		} else {
			this._super.treeForApp.call(this, _tree)
		}
	},

	treeForAddon(_tree) {
		if (this._hasOnlyOrExceptConfig()) {
			var tree = new Funnel(_tree, {
				exclude: ['addon/initializers/register-d3-version.js'],
			})
			this._super.treeForAddon.call(this, tree)
		} else {
			this._super.treeForAddon.call(this, _tree)
		}
	},

	treeForVendor() {
		// NOTE: This is a static string because we use Rollup to do the actual resolve.
		let nodeModulesPath = 'node_modules'

		let dependencies = this.d3Modules.map(dep => dep.name)

		// Rollup each D3 library
		let entry

		let tree = 'app'
		let trees = this.d3Modules.map(module => {
			entry = path.posix.join(nodeModulesPath, module.name, 'index.js')
			tree = rollupExternalPackage(tree, module.name, entry, dependencies, module.version)
			return tree
		})

		let d3SourcePath = path.posix.join(nodeModulesPath, 'd3')
		entry = path.posix.join(d3SourcePath, 'index.js')

		// Only package D3 bundle if all modules are included.
		if (!this._hasOnlyOrExceptConfig()) {
			// Rollup d3 with all module imports
			let d3Tree = rollupExternalPackage(tree, 'd3', entry, dependencies)

			trees.push(d3Tree)
		}
		return mergeTrees(trees, { overwrite: true })
	},

	_hasOnlyOrExceptConfig() {
		return (
			(this.addonConfig.only && this.addonConfig.only.length) ||
			(this.addonConfig.except && this.addonConfig.except.length)
		)
	},
}
