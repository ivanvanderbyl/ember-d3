var Rollup = require('broccoli-rollup');

module.exports = function(tree, moduleName, entry, external, version) {

  let rollup = {
    indent: true,
    external,
    entry,
    dest: [moduleName, 'js'].join('.'),
    format: 'amd',
    moduleId: moduleName
  };

  if (version) {
    let banner = `/* ${moduleName}: ${version} imported by ember-d3 */`;
    rollup.banner = banner;
  }

  return new Rollup(tree, {
    annotation: moduleName,
    rollup
  });
};
