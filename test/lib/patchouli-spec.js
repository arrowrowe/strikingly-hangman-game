const expect = require('chai').expect;

const patchouli = require('../../lib/patchouli');

describe('Patchouli', () => {

  before(() => {
    patchouli.words = [
      'aaabbb',
      'aaaddv',
      'aabccc',
      'aafggx'
    ];
  });

  it('suggests well', () => {

    const T = (pairs) => {
      const initialPair = pairs.shift();
      expect(patchouli.initialGuess(initialPair[0])).to.equal(initialPair[1]);
      pairs.forEach((pair) => expect(patchouli.guessWith(pair[0])).to.equal(pair[1]));
    };

    T([
      ['******', 'A'],
      ['aa****', 'C'],
      ['aa****', 'G']
    ]);

    T([
      ['******', 'A'],
      ['aa****', 'C'],
      ['aa*ccc', 'B'],
      ['aabccc', ''],
      ['', '']
    ]);

    T([
      ['******', 'A'],
      ['aaa***', 'B'],
      ['aaa***', 'D'],
      ['aaadd*', 'V'],
      ['aaadd*', ''],
      ['', '']
    ]);

  });

});
