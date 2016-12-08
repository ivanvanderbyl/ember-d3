# ember-d3 [![Build Status](https://travis-ci.org/brzpegasus/ember-d3.svg?branch=master)](https://travis-ci.org/brzpegasus/ember-d3) [![Ember Observer Score](https://emberobserver.com/badges/ember-d3.svg)](https://emberobserver.com/addons/ember-d3) [![npm version](https://badge.fury.io/js/ember-d3.svg)](https://badge.fury.io/js/ember-d3) [![Dependency Status](https://david-dm.org/brzpegasus/ember-d3.svg)](https://david-dm.org/brzpegasus/ember-d3) [![devDependency Status](https://david-dm.org/brzpegasus/ember-d3/dev-status.svg)](https://david-dm.org/brzpegasus/ember-d3.svg#info=devDependencies)

Ember shim for loading `d3@4.x.x`. To install:

```
ember install ember-d3
```

**Important:** You must be using NPM >= 3.0 and Node >= 4.0 for this to work,  
or you'll get errors when you start your app. Check by running `npm version`.

You can upgrade NPM by running:

```
npm i -g npm@3
```

D3 modules are loaded from NPM as ES2015 modules. It includes `d3-shape` and all version 4 modules in D3 `4.x`.

**If you're looking for the `ember-d3` for `d3@3.x`, see the `v3` branch.**

## Advanced Installation

If you need a specified d3 version, add this to your project:

```
npm install --save-dev d3@4.2.7
```

## Example usage:

```js
import { line } from 'd3-shape';
import { scaleOrdinal } from 'd3-scale';
import { extent } from 'd3-array';
```

We've put together a [complete demo component](https://github.com/brzpegasus/ember-d3/blob/master/tests/dummy/app/components/simple-circles.js) 
which you can use to really get a feel for how to use the different packages
provided by this addon.

## Specifying the `d3` version

This addon is simply a loader for the `d3` NPM package. If you would like to
specify a specific version on the d3 v4.x track, you can do so by installing that
version directly in your project, and this addon will load that version.

## Svelte Builds

In case you do not want to include *all* of d3's dependencies, you may whitelist the packages
that you want to include in your project's `config/environment.js` file.

For example, if you only wanted to use `d3-scale`, you would do:

```js
// config/environment.js
module.exports = function() {
  return {
    'ember-d3': {
      only: ['d3-scale']
    }
  };
};
```

Or if you want to exclude a package:

```js
// config/environment.js
module.exports = function() {
  return {
    'ember-d3': {
      except: ['d3-scale']
    }
  };
};
```

**Note**: Even though you only add `d3-scale`, it has a few transitive d3 dependencies.
These are added to your project automatically.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`
