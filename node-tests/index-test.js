/* eslint-env node */

const co = require('co');
const Promise = require('rsvp').Promise;
const path = require('path');
const fs = require('fs-extra');
const spawn = require('child_process').spawn;
const chalk = require('chalk');
const expect = require('chai').expect;

describe('index', function() {
  var subject;

  beforeEach(function() {
    subject = require('../index');
  });

  it('can find all D3 plugins', function() {
    var result = subject._getAllD3Modules();
    expect(result).to.equal('test-plugin');
  });
});
