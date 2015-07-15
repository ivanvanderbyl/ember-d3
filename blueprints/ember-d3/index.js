'use strict';

module.exports = {
  description: 'Imports D3 dependency from Bower',

  normalizeEntityName: function() {
    // no-op
  },

  afterInstall: function(options) {
    return this.addBowerPackageToProject('d3');
  }
};
