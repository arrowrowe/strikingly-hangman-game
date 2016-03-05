const T = require('../t')(require('../../lib/is-solved'));

describe('The function isSolved', () => {
  it('checks if a puzzle is already solved', () => {
    T(false, '*****');
    T(false, 'abc**');
    T(false, 'abcd*');
    T(true, 'abcde');
  });
});
