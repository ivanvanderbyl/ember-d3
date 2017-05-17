/* eslint "no-var":off, "ember-suave/prefer-destructuring":off */

var mergeTrees = require('broccoli-merge-trees');
var d3DepsForPackage = require('./lib/d3-deps-for-package');
var Rollup = require('broccoli-rollup');
var path = require('path');
var resolve = require('rollup-plugin-node-resolve');
var rollupExternalPackage = require('./lib/rollup-external-package');
module.exports = {
  isDevelopingAddon() {
    return false;
  },

  name: 'ember-d3',

  _getAllD3Modules() {
    return d3DepsForPackage('d3', this.parent.nodeModulesPath, this.ui);
  },

  included() {
    let d3Modules = this._getAllD3Modules();

    // Import each D3 module
    d3Modules.forEach((module) => {
      this.import(path.posix.join('vendor', `${module.name }.js`));
    });

    // Import D3 include for bundled imports
    this.import(path.posix.join('vendor', 'd3.js'));
  },

  treeForVendor() {
    let d3Modules = this._getAllD3Modules();
    let dependencies = d3Modules.map((dep) => dep.name);

    // Rollup each D3 library
    let entry;

    let tree = 'app';
    let trees = d3Modules.map((module) => {
      entry = path.join('node_modules', module.name, 'index.js');
      let t = rollupExternalPackage(tree, module.name, entry, dependencies);

      tree = t;

      return t;
    });

    let d3SourcePath = 'node_modules/d3';
    entry = path.join(d3SourcePath, 'index.js');

    let d3Tree = rollupExternalPackage(tree, 'd3', entry, dependencies);

    trees.push(d3Tree);
    return mergeTrees(trees);
  }

};
