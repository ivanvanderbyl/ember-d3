/* jshint node: true */
'use strict';

var path = require('path');

module.exports = function lookupPackage(packageName) {
  var modulePath = require.resolve(packageName);
  var i = modulePath.lastIndexOf(path.sep + 'build');
  return modulePath.slice(0, i);
};
