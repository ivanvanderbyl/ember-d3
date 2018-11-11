/* eslint-env node, mocha */

const expect = require('chai').expect

describe('index', function() {
  var subject

  beforeEach(function() {
    subject = require('../index')
  })

  it('can find all D3 plugins', function() {
    var result = subject._getAllD3Modules()
    expect(result).to.equal('test-plugin')
  })
})
