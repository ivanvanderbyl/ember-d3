module.exports = function exclusionFilter(packages) {
  return function(packageName) {
    if (packages.length === 0) { return true; }

    return packages.map(function(pkg) {
      return pkg.name;
    }).indexOf(packageName) === -1;
  };
};
