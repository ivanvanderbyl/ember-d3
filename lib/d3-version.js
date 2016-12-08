var path = require('path');
var fs = require('fs');
var lookupPackage = require('./lookup-package-build');

function pickPath(paths) {
  return paths.filter(function(p) {
    try {
      fs.statSync(p).isFile();
      return true;
    } catch(err) {
      return false;
    }
  })[0];
}

module.exports = function(packageName, nodeModulesPath) {
  var pathToPackageDefinition = pickPath([
    path.join(nodeModulesPath, packageName, 'package.json'),
    path.join(lookupPackage(packageName), 'package.json')
  ]);

  var pkg = require(pathToPackageDefinition);
  return pkg.version;
};
