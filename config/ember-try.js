module.exports = {
  useYarn: true,
  scenarios: [
    {
      name: 'ember-lts-2.16',
      npm: {
        devDependencies: {
          'ember-source': '~2.16.0',
          d3: '4.0.0'
        }
      }
    },

    {
      name: 'ember-2.18-d3-4.1',
      npm: {
        devDependencies: {
          'ember-source': '~2.18.0',
          d3: '4.1.0'
        }
      }
    },

    {
      name: 'ember-2.18-d3-4.2',
      npm: {
        devDependencies: {
          'ember-source': '~2.18.0',
          d3: '4.2.0'
        }
      }
    },

    {
      name: 'ember-2.18-d3-4.7',
      npm: {
        devDependencies: {
          'ember-source': '~2.18.0',
          d3: '4.7.0'
        }
      }
    },

    {
      name: 'ember-2.18-d3-4.4.13',
      npm: {
        devDependencies: {
          'ember-source': '~2.18.0',
          d3: '4.13.0'
        }
      }
    },

    {
      name: 'ember-3.0-d3-5.0.0',
      npm: {
        devDependencies: {
          'ember-source': '~3.0.0',
          d3: '^5.0.0'
        }
      }
    },

    {
      name: 'ember-3.0-d3-4.1',
      npm: {
        devDependencies: {
          'ember-source': '~3.0.0'
        },
        dependencies: {
          d3: '^4.1.0'
        }
      }
    },

    {
      name: 'ember-default',
      npm: {
        devDependencies: {}
      }
    }
  ]
}
