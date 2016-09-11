/* jshint node: true */
'use strict';

var path = require('path');
var lookupPackage = require('./lookup-package-build');
var isD3Dependency = require('./is-d3-dependency');

module.exports = function (packageName) {
  var pkg = require(path.join(lookupPackage(packageName), 'package.json'));
  return Object.keys(pkg.dependencies).filter(isD3Dependency);
};
