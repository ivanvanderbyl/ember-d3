/* jshint node: true */
'use strict';

var path = require('path');

module.exports = {
  name: 'ember-d3',

  included: function(app) {
    this._super.included(app);
    if (process.env.EMBER_CLI_FASTBOOT !== 'true') {
      // In nested addons, app.bowerDirectory might not be available
      var bowerDirectory = app.bowerDirectory || 'bower_components';
      // In ember-cli < 2.7, this.import is not available, so fall back to use app.import
      var importShim = typeof this.import !== 'undefined' ? this : app;

      importShim.import(bowerDirectory + '/d3/d3.js');
      importShim.import('vendor/ember-d3/ember-d3-shim.js', {
        exports: {
          d3: ['default']
        }
      });
    }
  },

  treeForVendor: function() {
    return path.join(__dirname, 'client');
  }
};
