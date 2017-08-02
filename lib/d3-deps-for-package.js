var path = require('path');
var fs = require('fs');
var lookupPackage = require('./lookup-package-build');
var isD3Dependency = require('./is-d3-dependency');

/**
 * Using the "d3" dependency as the source of truth for d3-* sub-modules,
 * this function returns all the d3 dependencies for the specified version of
 * d3.
 *
 * The resolving logic is:
 * - Use project node_modules path,
 * - assume d3 is at ./node_modules/d3
 * - assume package.json is called package.json
 *
 * NOTE: This implementation does not use require.lookup as it will usually
 * resolve to the versio specified by this addon, and not the project consuming
 * it.
 *
 * @public
 * @return {Array{Object}} Package name and path for specified D3 version
 */

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

module.exports = function(packageName, nodeModulesPath, ui) {
  var pathToPackageDefinition = pickPath([
    path.join(nodeModulesPath, packageName, 'package.json'),
    path.join(lookupPackage(packageName), 'package.json')
  ]);

  var packageBasePath = path.normalize(path.join(pathToPackageDefinition, '../..'));

  var pkg = require(pathToPackageDefinition);
  var pkgDependencies = pkg.dependencies;

  var project = require(nodeModulesPath + '/../package.json');
  var projectDependencies = project.devDependencies;

  var dependencies = Object.assign(pkgDependencies, projectDependencies);

  // TODO: Generalize use of d3 and externalize predicate
  var dependencyNames = Object.keys(dependencies).filter(isD3Dependency);

  return dependencyNames.map(function(packageName) {
    var packagePath = path.join(packageBasePath, packageName);

    try {
      fs.statSync(packagePath).isDirectory();
    } catch(err) {
      ui.writeWarnLine(`[ember-d3] d3 sub module: "${  packageName  }" is not installed, please reinstall d3`);
    }

    // Import existing builds from node d3 packages, which are UMD packaged.
    var packageBuildPath = path.join('build', `${ packageName }.js`);

    return {
      name: packageName,
      path: packagePath,
      buildPath: packageBuildPath
    };
  });
};
