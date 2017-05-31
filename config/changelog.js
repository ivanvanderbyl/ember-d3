// jshint node:true

// For details on each option run `ember help release`
module.exports = {

  // angular style guide: https://github.com/angular/angular.js/blob/v1.4.8/CONTRIBUTING.md#commit
  // jquery style guide: https://contribute.jquery.org/commits-and-pull-requests/#commit-guidelines
  // ember style guide: https://github.com/emberjs/ember.js/blob/master/CONTRIBUTING.md#commit-tagging
  style: 'ember', // 'ember' 'jquery'

  head: 'master',
  base: 'v0.1.0', // a branch or tag name, `-last` defaults to the version in package.json

  // project: 'ivanvanderbyl/ember-d3',

  hooks: {
    /*
     parser: function(commit) { return commit; }
     filter: function(commit) { return true; },
     groupSort: function(commits) { return { commits: commits }; },
     format: function(commit) { return commit.title; },
     */
  }

};
