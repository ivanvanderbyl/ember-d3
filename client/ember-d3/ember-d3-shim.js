(function() {
  /* globals define, d3 */

  function generateModule(name, values) {
    define(name, [], function() {
      'use strict';

      return values;
    });
  }

  generateModule('d3', { 'default': d3 });
})();
