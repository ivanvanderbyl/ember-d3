/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');
var lookupPackage = require('./lookup-package-build');
var d3PackagePath = lookupPackage('d3');

module.exports = function (packageName) {
  var d3PathToSrc;

  // Import existing builds from node d3 packages, which are UMD packaged.
  var packageBuildPath = path.join('build', packageName + '.js');

  /*
    This path is used only if NPM packaged the dependencies in the d3 module,
    as it does during dev,
   */
  d3PathToSrc = path.join(d3PackagePath, 'node_modules', packageName);

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

  return {
    packageBuildPath: packageBuildPath,
    d3PathToSrc: d3PathToSrc,
    packageName: packageName,
  };
};
