# `ember-d3` Changelog

### 0.3.1 (December 8, 2016)

- Refctored internal recasting Funnel.
- Stopped logging D3 version number to stdout.
- Register D3 version number with `Ember.libraries` so it's visiable in Ember Inspector.

### 0.3.0 (October 17, 2016)

- [BREAKING] - Removed D3 v3.x support (See [v3 branch](https://github.com/brzpegasus/ember-d3/tree/v3)),
- [[PR#8](https://github.com/brzpegasus/ember-d3/pull/8)] [BREAKING] - Added D3 v4.x support as ES6 modules,
  - Added support for configuring `only` and `exclude` when loading modules,
  - Added this changelog,
  - Added tests for loading D3 modules,
  - Added support for consuming addon's to specify a D3 v4.x version.
