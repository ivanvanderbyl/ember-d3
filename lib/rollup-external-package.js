var Rollup = require('broccoli-rollup');

module.exports = function(tree, moduleName, entry, external) {
  return new Rollup(tree, {
    annotation: moduleName,
    cache: true,
    indent: false,

    rollup: {
      external,
      entry,
      dest: [moduleName, 'js'].join('.'),
      format: 'amd',
      moduleId: moduleName
    }
  });
};
