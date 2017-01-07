/* eslint "no-var":off, "ember-suave/prefer-destructuring":off */

var recast = require('recast');
var types = recast.types;
var b = recast.types.builders;

module.exports = function replaceVersionString(code, packageName, options) {
  var version = options.version;

  var ast = recast.parse(code);
  types.visit(ast, {
    visitLiteral(path) {
      if (path.node.value === '<D3_VERSION>') {
        return b.literal(version);
      } else {
        this.traverse(path);
      }
    }
  });

  return recast.print(ast).code;
};
