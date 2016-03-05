const T = require('../t')(require('../../lib/match'));

describe('The function match', () => {
  it('checks if two words matches considering one character', () => {
    T(true, 'a', 'apple', 'a****');
    T(false, 'a', 'apple', '*****');
    T(false, 'a', 'apple', '**a**');
    T(true, 'p', 'apple', '*pp**');
    T(false, 'p', 'apple', '*p***');
    T(false, 'p', 'apple', '**p**');
    T(false, 'p', 'apple', '****p');
    T(false, 'p', 'apple', '*****');
    T(true, 'c', 'apple', '*****');
    T(false, 'c', 'apple', '**c**');
  });
});
