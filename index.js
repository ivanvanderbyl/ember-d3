/* jshint node: true */
'use strict';

var path = require('path');

module.exports = {
  name: 'ember-d3',

  included: function(app) {
    this._super.included(app);

    app.import(app.bowerDirectory + '/d3/d3.js');
    app.import('vendor/ember-d3/ember-d3-shim.js', {
      exports: {
        d3: ['default']
      }
    });
  },

  treeForVendor: function() {
    return path.join(__dirname, 'client');
  }
};
