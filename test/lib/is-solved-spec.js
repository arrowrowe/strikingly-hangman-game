const T = require('../t')(require('../../lib/is-solved'));

describe('The function isSolved', () => {
  it('checks if two words matches considering one character', () => {
    T(false, '*****');
    T(false, 'abc**');
    T(false, 'abcd*');
    T(true, 'abcde');
  });
});
