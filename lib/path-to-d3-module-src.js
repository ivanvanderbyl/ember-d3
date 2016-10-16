/* eslint "no-var":off, "ember-suave/prefer-destructuring":off */

var fs = require('fs');
var path = require('path');
var lookupPackage = require('./lookup-package-build');

module.exports = function(nodeModulesPath, ui) {
  // console.log('path to d3', nodeModulesPath);

  return function(packageName) {
    var d3PackagePath, d3PathToSrc;

    if (nodeModulesPath) {
      d3PackagePath = path.join(nodeModulesPath, packageName);

    } else {
      d3PackagePath = lookupPackage('d3');
    }

    // Import existing builds from node d3 packages, which are UMD packaged.
    var packageBuildPath = path.join('build', `${packageName  }.js`);

    /*
      This path is used only if NPM packaged the dependencies in the d3 module,
      as it does during dev,
     */
    d3PathToSrc = path.join(d3PackagePath, 'node_modules', packageName);

    try {
      fs.statSync(path.join(d3PathToSrc)).isDirectory();
    } catch(err) {
      // ui.writeError('[ember-d3] You need to add d3@4.x as a dependency in your project to use ember-d3');
      d3PathToSrc = lookupPackage(packageName);
    }

    try {
      fs.statSync(path.join(d3PathToSrc, packageBuildPath)).isFile();
    } catch(err) {
      console.error(`[ERROR] D3 Package (${  packageName  }) is not built as expected, cannot continue. Please report this as a bug.`);
      return;
    }

    return {
      packageBuildPath,
      d3PathToSrc,
      packageName
    };
  };
};
