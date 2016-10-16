/* eslint "no-var":off, "ember-suave/prefer-destructuring":off */

var Filter = require('broccoli-filter');
var rewriteAMDFunction = require('./rewrite-amd-definition');

/**
 * Loading an actual AMD package using Ember's loader.js
 * requires some hacks. Basically proper AMD packages check for define.amd, which
 * loader.js doesn't define (because reasons).
 *
 * To get around this we define our own definition in the same way each Ember
 * package does.
 */

function AMDDefineFilter(inputNode, packageName, options) {
  options = options || {};
  Filter.call(this, inputNode, {
    annotation: options.annotation || `Rewriting package: ${  packageName}`
  });
  this.packageName = packageName;
}

AMDDefineFilter.prototype = Object.create(Filter.prototype);
AMDDefineFilter.prototype.constructor = AMDDefineFilter;
AMDDefineFilter.prototype.processString = function(code) {
  return rewriteAMDFunction(code, this.packageName);
};

module.exports = AMDDefineFilter;
