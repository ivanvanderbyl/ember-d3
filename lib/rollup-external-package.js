var Rollup = require('broccoli-rollup');

module.exports = function(tree, moduleName, entry, external, version) {
  return new Rollup(tree, {
    annotation: moduleName,
    cache: true,
    rollup: {
      indent: false,
      banner: `/* ${moduleName}: ${version} imported by ember-d3 */`,
      external,
      entry,
      dest: [moduleName, 'js'].join('.'),
      format: 'amd',
      moduleId: moduleName
    }
  });
};
