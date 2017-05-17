import Ember from 'ember';
import { version } from 'd3';
const { libraries } = Ember;

export function initialize(/* application */) {
  var registered = false;
  if (!registered) {
    libraries.register('D3.js', version);
    registered = true;
  }
}

export default {
  name: 'register-d3-version',
  initialize
};
