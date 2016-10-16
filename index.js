/* eslint "no-var":off, "ember-suave/prefer-destructuring":off */
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var path = require('path');
var rename = require('broccoli-stew').rename;
var AMDDefineFilter = require('./lib/amd-define-filter');
var d3DepsForPackage = require('./lib/d3-deps-for-package');
// var pathToD3Source = require('./lib/path-to-d3-module-src');
var inclusionFilter = require('./lib/inclusion-filter');
var exclusionFilter = require('./lib/exclusion-filter');

module.exports = {
  isDevelopingAddon() {
    return false;
  },

  name: 'ember-d3',

  /**
   * Array of d3 packages to load
   *
   * @private
   * @type {Array<String>}
   */
  d3Modules: [],

  /**
   * `import()` taken from ember-cli 2.7
   * @private
   */
  import(asset, options) {
    var app = this.app;
    while (app.app) {
      app = app.app;
    }

    app.import(asset, options);
  },

  included(app) {
    this._super.included && this._super.included.apply(this, arguments);
    this.app = app;

    /*
      Find all dependencies of `d3`
     */
    var config = app.project.config(app.env) || {};
    var addonConfig = config[this.name] || {};
    this.d3Modules = this.getD3Modules(addonConfig);

    /*
      This essentially means we'll skip importing this package twice, if it's
      a dependency of another package.
     */
    if (!this.import) {
      if (this.isDevelopingAddon()) {
        this.ui.writeWarnLine('[ember-d3] skipping included hook for', this.name);
      }

      return;
    }

    /*
      Actually import the vendor tree packages to our app.
     */
    var _this = this;
    this.d3Modules.forEach(function(pkg) {
      _this.import(path.join('vendor', pkg.name, `${pkg.name  }.js`));
    });
  },

  getD3Modules(config) {
    var allModules = this._getAllD3Modules();
    var onlyModules = config.only || [];
    var exceptModules = config.except || [];

    return allModules
      .filter(inclusionFilter(onlyModules))
      .filter(exclusionFilter(exceptModules));
  },

  _getAllD3Modules() {
    return d3DepsForPackage('d3', this.parent.nodeModulesPath, this.ui);
  },

  treeForVendor(tree) {
    var trees = [];

    if (tree) {
      trees.push(tree);
    }

    this.d3Modules.forEach(function(pkg) {
      if (!(pkg && pkg.path)) {
        return;
      }

      var tree = new Funnel(pkg.path, {
        include: [pkg.buildPath],
        destDir: `/${  pkg.name}`,
        annotation: `Funnel: D3 Source [${  pkg.name  }]`
      });

      var srcTree = new AMDDefineFilter(tree, pkg.name);
      trees.push(rename(srcTree, function() {
        return `/${  pkg.name  }/${  pkg.name  }.js`;
      }));
    });

    return mergeTrees(trees);
  }
};
