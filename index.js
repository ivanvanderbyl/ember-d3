/* jshint node: true */
/* jshint esnext: false */
'use strict';

var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var path = require('path');
var rename = require('broccoli-stew').rename;
var AMDDefineFilter = require('./lib/amd-define-filter');
var fs = require('fs');

function lookupPackage(packageName) {
  var modulePath = require.resolve(packageName);
  var i = modulePath.lastIndexOf(path.sep + 'build');
  return modulePath.slice(0, i);
}

module.exports = {
  name: 'ember-d3',

  isDevelopingAddon: function () {
    return false;
  },

  d3Modules: [

    // Imported from package.json
  ],

  /**
   * `import()` taken from ember-cli 2.7 to allow nested addon usage.
   */
  import: function (asset, options) {
    var app = this.app;
    while (app.app) {
      app = app.app;
    }

    app.import(asset, options);
  },

  included: function (app) {
    this._super.included && this._super.included.apply(this, arguments);
    this.app = app;

    while (app.app) {
      app = app.app;
    }

    var pkg = require(path.join(lookupPackage('d3'), 'package.json'));

    // Find all dependencies of `d3`
    this.d3Modules = Object.keys(pkg.dependencies).filter(function (name) {
      return /^d3\-/.test(name);
    });

    // This essentially means we'll skip importing this package twice, if it's
    // a dependency of another package.
    if (!app.import) {
      if (this.isDevelopingAddon()) {
        console.log('[ember-cli-d3-shape] skipping included hook for', app.name);
      }

      return;
    }

    var _this = this;
    this.d3Modules.forEach(function (packageName) {
      _this.import(path.join('vendor', packageName, packageName + '.js'));
    });
  },

  treeForApp() {
    return null;
  },

  treeForAddon() {
    return null;
  },

  treeForVendor: function () {
    var trees = [];
    var d3PackagePath = lookupPackage('d3');

    this.d3Modules.forEach(function (packageName) {
      // Import existing builds from node d3 packages, which are UMD packaged.
      var packageBuildPath = path.join('build', packageName + '.js');

      var d3PathToSrc = path.join(d3PackagePath, 'node_modules', packageName);

      try {
        fs.statSync(path.join(d3PathToSrc)).isDirectory();
      } catch (err) {
        d3PathToSrc = lookupPackage(packageName);
      }

      try {
        fs.statSync(path.join(d3PathToSrc, packageBuildPath)).isFile();
      } catch (err) {
        console.error('[ERROR] D3 Package (' + packageName + ') is not built as expected, cannot continue. Please report this as a bug.');
        return;
      }

      var tree = new Funnel(d3PathToSrc, {
        include: [packageBuildPath],
        destDir: '/' + packageName,
        annotation: 'Funnel: D3 Source [' + packageName + ']',
      });

      var srcTree = new AMDDefineFilter(tree, packageName);
      trees.push(rename(srcTree, function () {
        return '/' + packageName + '/' + packageName + '.js';
      }));
    });

    return mergeTrees(trees);
  },
};
