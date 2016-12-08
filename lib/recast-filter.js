/* eslint "no-var":off, "ember-suave/prefer-destructuring":off */

var Filter = require('broccoli-filter');

/*
 * Loading an actual AMD package using Ember's loader.js
 * requires some hacks. Basically proper AMD packages check for define.amd, which
 * loader.js doesn't define (because reasons).
 *
 * To get around this we define our own definition in the same way each Ember
 * package does.
 */

function RecastFilter(inputNode, packageName, recastFn, options) {
  options = options || {};
  Filter.call(this, inputNode, {
    annotation: options.annotation || `Recasting package: ${  packageName}`
  });
  this.packageName = packageName;
  this.recastFn = recastFn;
  this.options = options;
}

RecastFilter.prototype = Object.create(Filter.prototype);
RecastFilter.prototype.constructor = RecastFilter;
RecastFilter.prototype.processString = function(code) {
  return this.recastFn.apply(this, [code, this.packageName, this.options]);
};

module.exports = RecastFilter;
