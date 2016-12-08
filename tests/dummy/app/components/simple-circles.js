/*
 * This dummy component demonstrates how to use ember-d3 to build a simple
 * data visualization. It's an extension of the https://bost.ocks.org/mike/circles/
 * example with some more fancy elements.
 *
 * In this example we receive data from our dummy data source in the index route,
 * which sends us new data every second.
 *
 * When new data arrives we calculate 2 scales, one for x and y, representing
 * placement on the x plane, and relative size for the radius of the circles.
 *
 * The scale functions use some handy helpers from the d3-array package to figure
 * out the size of our dataset.
 *
 * We also initialize a transition object which will be used towards the end to
 * transition the data `merge` from new data to existing data.
 */

import Ember from 'ember';
import Component from 'ember-component';
import layout from '../templates/components/simple-circles';

// Import the D3 packages we want to use
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { extent, ascending } from 'd3-array';
import { transition } from 'd3-transition';
import { easeCubicInOut } from 'd3-ease';

const { run, get } = Ember;

export default Component.extend({
  layout,

  tagName: 'svg',
  classNames: ['awesome-d3-widget'],

  width: 720,
  height: 200,

  attributeBindings: ['width', 'height'],

  // Array of points to render as circles in a line, spaced by time.
  //  [ {value: Number, timestamp: Number } ];
  data: [],

  didReceiveAttrs() {
    // Schedule a call to our `drawCircles` method on Ember's "render" queue, which will
    // happen after the component has been placed in the DOM, and subsequently
    // each time data is changed.
    run.scheduleOnce('render', this, this.drawCircles);
  },

  drawCircles() {
    let plot = select(this.element);
    let data = get(this, 'data');
    let width = get(this, 'width');
    let height = get(this, 'height');

    // Create a transition to use later
    let t = transition().duration(250).ease(easeCubicInOut);

    // X scale to scale position on x axis
    let xScale = scaleLinear()
      .domain(extent(data.map((d) => d.timestamp)))
      .range([0, width]);

    // Y scale to scale radius of circles proportional to size of plot
    let yScale = scaleLinear()
      .domain(
        // `extent()` requires that data is sorted ascending
        extent(data.map((d) => d.value).sort(ascending)))
      .range([0, height]);

    // UPDATE EXISTING
    let circles = plot.selectAll('circle').data(data);

    // EXIT
    circles.exit()
      .transition(t)
      .attr('r', 0)
      .remove();

    // ENTER
    let enterJoin = circles.enter()
      .append('circle')
      .attr('fill', 'steelblue')
      .attr('opacity', 0.5)

      // Set initial size to 0 so we can animate it in from 0 to actual scaled radius
      .attr('r', () => 0)
      .attr('cy', () => height / 2)
      .attr('cx', (d) => xScale(d.timestamp));

    // MERGE + UPDATE EXISTING
    enterJoin.merge(circles)
      .transition(t)
      .attr('r', (d) => yScale(d.value) / 2)
      .attr('cy', () => height / 2)
      .attr('cx', (d) => xScale(d.timestamp));
  }
});
