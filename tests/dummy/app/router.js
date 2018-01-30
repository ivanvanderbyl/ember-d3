import config from './config/environment'
import EmberRouter from 'ember-router'

const Router = EmberRouter.extend({
	location: config.locationType,
	rootURL: config.rootURL
})

Router.map(function() {})

export default Router
