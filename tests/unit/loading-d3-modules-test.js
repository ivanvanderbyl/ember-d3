import { module, test } from 'qunit';
import { mean } from 'd3-array';
import { axisTop } from 'd3-axis';
import { brush } from 'd3-brush';
import { keys } from 'd3-collection';
import { color } from 'd3-color';
import { dispatch } from 'd3-dispatch';
import { drag } from 'd3-drag';
import { csvParse } from 'd3-dsv';
import { easeLinear } from 'd3-ease';
import { forceSimulation } from 'd3-force';
import { format } from 'd3-format';
import { hierarchy } from 'd3-hierarchy';
import { interpolateNumber } from 'd3-interpolate';
import { path } from 'd3-path';
import { polygonCentroid } from 'd3-polygon';
import { quadtree } from 'd3-quadtree';
import { queue } from 'd3-queue';
import { randomUniform } from 'd3-random';
import { request } from 'd3-request';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { line } from 'd3-shape';
import { timeDay } from 'd3-time';
import { timeFormat } from 'd3-time-format';
import { timeout } from 'd3-timer';
import { transition } from 'd3-transition';
import { voronoi } from 'd3-voronoi';

module('Unit | D3 Module Loading Test');

test('loading d3-array', function(assert) {
  assert.equal(mean([1,2,3]), 2);
});

test('loading d3-axis', function(assert) {
  assert.equal(typeof axisTop, 'function', 'loaded axisTop');
});

test('loading d3-brush', function(assert) {
  assert.equal(typeof brush, 'function', 'loaded brush');
});

test('loading d3-collection', function(assert) {
  assert.equal(typeof keys, 'function', 'loaded keys');
});

test('loading d3-color', function(assert) {
  assert.equal(color('#FFFFFF').toString(), 'rgb(255, 255, 255)', 'loaded color');
});

test('loading d3-dispatch', function(assert) {
  assert.expect(1);
  let handler = dispatch('start');
  handler.on('start', function(value) {
    assert.ok(value, 'it works');
  });
  handler.call('start', this, true);
});

test('loading d3-drag', function(assert) {
  assert.equal(typeof drag, 'function', 'loaded drag');
});

test('loading d3-dsv', function(assert) {
  assert.deepEqual(csvParse('name,location\nIvan,Unknown'), [
    {
      'location': 'Unknown',
      'name': 'Ivan'
    }
  ], 'loaded dsv');
});

test('loading d3-ease', function(assert) {
  assert.equal(easeLinear(0.1), 0.1, 'loaded easeLinear');
});

test('loading d3-force', function(assert) {
  assert.equal(typeof forceSimulation, 'function', 'loaded forceSimulation');
});

test('loading d3-format', function(assert) {
  assert.equal(format('$,.2f')(1200.98), '$1,200.98', 'loaded d3 format');
});

test('loading d3-hierarchy', function(assert) {
  assert.equal(typeof hierarchy, 'function', 'loaded hierarchy');
});

test('loading d3-interpolate', function(assert) {
  assert.equal(interpolateNumber(10, 20)(0.2), 12, 'loaded interpolate');
});

test('loading d3-path', function(assert) {
  let p = path();
  p.moveTo(10, 10);
  p.lineTo(10, 20);
  p.closePath();
  assert.equal(p.toString(), 'M10,10L10,20Z', 'loaded path');
});

test('loading d3-polygon', function(assert) {
  assert.deepEqual(polygonCentroid([[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]), [0.5,0.5], 'loaded polygonCentroid');
});

test('loading d3-quadtree', function(assert) {
  let q = quadtree();
  assert.deepEqual(q.add([0, 0]).root(), { data: [0, 0] });
  assert.deepEqual(q.add([1, 1]).root(), [{ data: [0, 0] }, undefined, undefined, { data: [1, 1] }]);
  assert.deepEqual(q.add([1, 0]).root(), [{ data: [0, 0] }, { data: [1, 0] }, undefined, { data: [1, 1] }]);
  assert.deepEqual(q.add([0, 1]).root(), [{ data: [0, 0] }, { data: [1, 0] }, { data: [0, 1] }, { data: [1, 1] }]);
});

test('loading d3-queue', function(assert) {
  let done = assert.async();
  assert.expect(2);
  let t = function(callback) {
    setTimeout(function() {
      callback(null, 10);
    }, 30);
  };

  queue().defer(t).awaitAll(callback);

  function callback(error, results) {
    assert.equal(null, error);
    assert.deepEqual(results, [ 10 ]);
    done();
  }
});

test('loading d3-random', function(assert) {
  assert.equal(randomUniform(6, 10)() > 6, true, 'loaded random');
});

test('loading d3-request', function(assert) {
  assert.equal(typeof request, 'function', 'loaded request');
});

test('loading d3-scale', function(assert) {
  let xScale = scaleLinear().domain([0,100]).rangeRound([0,500]);
  assert.equal(xScale(10), 50, 'loaded scale');
});

test('loading d3-selection', function(assert) {
  assert.equal(typeof select, 'function', 'loaded selection');
});

test('loading d3-shape', function(assert) {
  let l = line();
  l.x((d) => d.x);
  l.y((d) => d.y);
  let data = [
    { x: 1, y: 93.24 },
    { x: 2, y: 95.35 },
    { x: 3, y: 98.84 },
    { x: 4, y: 99.92 },
    { x: 5, y: 99.80 },
    { x: 6, y: 99.47 }
  ];

  assert.equal(l(data), 'M1,93.24L2,95.35L3,98.84L4,99.92L5,99.8L6,99.47', 'loaded shape');
});

test('loading d3-time', function(assert) {
  assert.deepEqual(timeDay.floor(new Date(2010, 11, 31, 23)), new Date(2010, 11, 31));
  assert.deepEqual(timeDay.floor(new Date(2011, 0, 1, 0)), new Date(2011, 0, 1));
  assert.deepEqual(timeDay.floor(new Date(2011, 0, 1, 1)), new Date(2011, 0, 1));
});

test('loading d3-time-format', function(assert) {
  let f = timeFormat('%c');
  assert.equal(f(+new Date(1990, 0, 1)), '1/1/1990, 12:00:00 AM');
});

test('loading d3-timer', function(assert) {
  assert.expect(1);
  let done = assert.async();
  let delay = 50;
  timeout(function() {
    assert.ok(true, 'loaded timer');
    done();
  }, delay);
});

test('loading d3-transition', function(assert) {
  assert.equal(typeof transition, 'function', 'loaded transition');
});

test('loading d3-voronoi', function(assert) {
  let v = voronoi();
  assert.equal(v.extent(), null);
  assert.equal(v.size(), null);
  assert.equal(v.x()([1, 2]), 1);
  assert.equal(v.y()([1, 2]), 2);
});
