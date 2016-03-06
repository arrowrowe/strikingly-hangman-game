const T = require('../t')(require('../../lib/padding'));

describe('The function padding', () => {
  it('adds prefix or suffix to make a given string not too short', () => {
    T('abcdefg', 'abcdefg', 'abc');
    T('abcdefg', 'abcdefg', 'abc', ' ', false);
    T('00abc', 'abc', 'abcde');
    T('**abc', 'abc', 'abcde', '*', true);
    T('abc--', 'abc', 'abcde', '-', false);
  });
});
