# ember-d3 [![Build Status](https://travis-ci.org/brzpegasus/ember-d3.svg?branch=master)](https://travis-ci.org/brzpegasus/ember-d3) [![Ember Observer Score](https://emberobserver.com/badges/ember-d3.svg)](https://emberobserver.com/addons/ember-d3) [![npm version](https://badge.fury.io/js/ember-d3.svg)](https://badge.fury.io/js/ember-d3) [![Dependency Status](https://david-dm.org/brzpegasus/ember-d3.svg)](https://david-dm.org/brzpegasus/ember-d3) [![devDependency Status](https://david-dm.org/brzpegasus/ember-d3/dev-status.svg)](https://david-dm.org/brzpegasus/ember-d3.svg#info=devDependencies)

This addon does one thing: load `d3@4.x.x` into your app or addon, so you can use D3 as you please on its own or as part of a visualisation addon.

```
ember install ember-d3
```

**Important:** You must be using NPM >= 3.0 and Node >= 6.0 for this to work,
or you'll get errors when you start your app. Check by running `npm version`.

You can upgrade NPM by running:

```
npm i -g npm@3
```

**If you're looking for the `ember-d3` for `d3@3.x`, see the `v3` branch.**

## Advanced Installation

You can specify any `d3` version on the v4 release by adding it to your project:

```
npm install --save-dev d3@4.9.0
```

## Usage:

There's two ways to use this library in your project, you can either load just
the APIs you desire, or you can import the entire D3 object (similar to version 3).

Option 1:

```js
import { line } from 'd3-shape'
import { scaleOrdinal } from 'd3-scale'
import { extent } from 'd3-array'
```

Option 2:

```js
import D3 from 'd3'
```

We've put together a [complete demo component](https://github.com/brzpegasus/ember-d3/blob/master/tests/dummy/app/components/simple-circles.js)
which you can use to really get a feel for how to use the different packages provided by this addon.

## Tree Shaking

Under the hood we use Rollup to compile all the dependencies for D3, and Rollup supports basic tree-shaking. If you want to avoid loading packages you don't need, you can exclude them in your project's config.

**Note:** If you exclude a package which
a dependency of another package, it will be loaded regardless to fulfil that dependency.

**Note 2:** The global import of `d3` requires all packages, and must be on the exclusion list for this to have any effect.

#### Dependency whitelist/blacklist

In case you do not want to include _all_ of d3's dependencies, you may whitelist
the packages that you want to include in your project's `config/environment.js` file.

For example, if you only wanted to use `d3-scale`, you would do:

```js
// config/environment.js
module.exports = function() {
	return {
		'ember-d3': {
			only: ['d3-scale']
		}
	}
}
```

Or if you want to exclude a package:

```js
// config/environment.js
module.exports = function() {
	return {
		'ember-d3': {
			except: ['d3-scale']
		}
	}
}
```

**Note**: Even though you only add `d3-scale`, it has a few transitive d3 dependencies.
These are added to your project automatically.

## Running Tests

* `yarn test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

# Contributing

This addon is developed by the community and is maintained by [Ivan Vanderbyl](https://github.com/ivanvanderbyl).

All contributions are welcome by opening an issue or Pull Request.
