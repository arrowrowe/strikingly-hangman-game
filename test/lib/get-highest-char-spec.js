const T = require('../t')(require('../../lib/get-highest-char'));

describe('The function getHighestChar', () => {
  it('finds the key with largest value', () => {
    T('a', {'a': 3});
    T('a', {'a': 3, 'b': 2});
    T('a', {'a': 3, 'b': 2, 'c': 1});
  });
  it('returns a zero-length string if not given statistics', () => {
    T('', {});
  });
});
