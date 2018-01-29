import Ember from 'ember'
import { version } from 'd3'
const { libraries } = Ember

let registered = false
if (!registered) {
	libraries.register('D3.js', version)
	registered = true
}

export function initialize(/* application */) {}

export default {
	name: 'register-d3-version',
	initialize,
}
