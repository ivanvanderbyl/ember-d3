/* eslint-disable */

const path = require('path')
const mergeTrees = require('broccoli-merge-trees')
const Funnel = require('broccoli-funnel')
const inclusionFilter = require('./lib/inclusion-filter')
const exclusionFilter = require('./lib/exclusion-filter')
const UnwatchedDir = require('broccoli-source').UnwatchedDir
const existsSync = require('exists-sync')

module.exports = {
  isDevelopingAddon() {
    return true
  },

  name: 'ember-d3',

  allD3Modules(target) {
    let deps = target.dependencies()
    let d3ModuleNames = Object.keys(deps).filter(dep => dep.startsWith('d3'))
    let ui = this.ui

    if (d3ModuleNames.indexOf('d3') === -1) {
      ui.writeError(
        "ERROR: Package d3 is not installed, please add it to your project's dependencies"
      )
      return []
    } else {
      d3ModuleNames = [...d3ModuleNames, ...dependenciesForPackage('d3')]
    }

    let paths = d3ModuleNames.map(name => {
      let modulePath = resolveSync(name, true)
      return { name, path: modulePath, basename: path.basename(modulePath) }
    })

    return paths

    function dependenciesForPackage(depName) {
      try {
        let pkgPath = resolveSync(path.join(depName, 'package.json'))
        return Object.keys(target.project.require(pkgPath).dependencies).filter(dep =>
          dep.startsWith('d3-')
        )
      } catch (err) {
        ui.writeError(
          `ERROR: Package d3 is not installed (required by "${depName}"), please add it to your project's dependencies`
        )
        return []
      }
    }

    function resolveSync(name, isBrowserTarget) {
      if (isBrowserTarget === undefined) isBrowserTarget = false
      return require('resolve').sync(name, {
        basedir: target.project.root,
        packageFilter(pkg, agr2) {
          if (isBrowserTarget) {
            if (pkg.hasOwnProperty('unpkg')) {
              // D3 publishes browser build at `unpkg`
              pkg.main = undefined
              pkg.main = pkg.unpkg
            } else if (pkg.hasOwnProperty('jsdelivr')) {
              // Some older d3 packages may only contain jsdelivr, which is browser
              pkg.main = undefined
              pkg.main = pkg.jsdelivr
            } else if (pkg.hasOwnProperty('browser')) {
              // Some older d3 packages (d3-request) may only contain browser directive
              pkg.main = undefined
              pkg.main = pkg.browser
            }
          }
          return pkg
        }
      })
    }
  },

  filterD3Modules(modules, config) {
    /**
     * config.bundle will import all d3 packages as d3, this is identical to d3.js
     *
     * Cannot be used with any other options.
     */
    if (config.bundle) {
      return modules.filter(({ name }) => name === 'd3')
    } else {
      modules = modules.filter(({ name }) => name !== 'd3')

      /**
       * config.only accepts a list of packages to include from all included dependencies of d3.
       */
      var onlyModules = config.only || []

      /**
       * config.except accepts a list of package name to exclude from the build,
       * this is the opposite of only.
       */
      var exceptModules = config.except || []

      return modules.filter(inclusionFilter(onlyModules)).filter(exclusionFilter(exceptModules))
    }
  },

  included(app) {
    this._super.included.apply(this, arguments)

    // 1. Find target app to locate d3 dependencies from
    let target = findTargetHost(this, app)

    // 2. Load app config for our addon
    let config = app.project.config(app.env) || {}
    let addonConfig = config[this.name] || {}
    this.d3Modules = this.filterD3Modules(this.allD3Modules(target), addonConfig)

    this.d3Modules.forEach(({ name, basename, path: modulePath }) => {
      target.import(path.join('vendor', 'd3', basename), {
        using: [{ transformation: 'amd', as: name }]
      })
    })
  },

  afterInstall() {
    return this.addPackageToProject('d3')
  },

  treeForVendor() {
    let trees = []

    let modules = this.d3Modules
    if (!modules) {
      return mergeTrees(trees)
    }

    modules.forEach(({ name, path: modulePath, basename }) => {
      let dir = path.dirname(modulePath)

      trees.push(
        Funnel(new UnwatchedDir(dir), {
          files: [basename],
          annotation: `basename`,
          destDir: '/d3'
        })
      )
    })

    return mergeTrees(trees, { overwrite: true })
  }
}

function findTargetHost(addon, app) {
  let target = app

  if (typeof addon.import === 'function') {
    target = addon
  } else {
    // If the addon has the _findHost() method (in ember-cli >= 2.7.0), we'll just
    // use that.
    if (typeof addon._findHost === 'function') {
      target = addon._findHost()
    }

    // Otherwise, we'll use this implementation borrowed from the _findHost()
    // method in ember-cli.
    // Keep iterating upward until we don't have a grandparent.
    // Has to do this grandparent check because at some point we hit the project.
    let current = addon
    do {
      target = current.app || app
    } while (current.parent.parent && (current = current.parent))
  }

  return target
}

// function checkForMinBuildFile(modulePath) {
// 	if(modulePath.endsWith('.min.js')) return modulePath

// 	let dirname = path.dirname(modulePath)
// 	let basename = path.basename(modulePath, 'js')
// 	let minBasename = `${basename}.min.js`
// 	let minPath = path.join(dirname, minBasename)
// 	if (existsSync(minPath)) return minPath
// 	return modulePath
// }
