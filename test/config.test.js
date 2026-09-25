const assert = require('node:assert/strict');
const { parsePort } = require('../config');
const { it } = require('node:test');


  it('defaults to port 8080', () => {
    assert.equal(parsePort(undefined), 8080);
  });

  it('accepts a configured port', () => {
    assert.equal(parsePort('3000'), 3000);
  });

  it('accepts the valid port boundaries', () => {
    assert.equal(parsePort('1'), 1);
    assert.equal(parsePort('65535'), 65535);
  });

  it('rejects invalid port values', () => {
    for (const value of ['', 'abc', '0', '-1', '65536', '8080.5']) {
      assert.throws(() => parsePort(value), /PORT must be/);
    }
  });
