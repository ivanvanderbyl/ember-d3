module.exports = {
	root: true,
	parserOptions: {
		ecmaVersion: 5,
		sourceType: 'module'
	},
	extends: ['eslint:recommended'],
	env: {
		browser: false,
		node: true
	},
	rules: {
		'no-var': 'off'
	}
}
