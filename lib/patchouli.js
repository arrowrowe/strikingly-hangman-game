// Named after Patchouli Knowledge.
// http://en.touhouwiki.net/wiki/Patchouli_Knowledge

'use strict';

const POSSIBLE_CHARS = 'abcdefghijklmnopqrstuvwxyz';

const Rates = () => {
  const rates = Object.create(null);
  for (let char of POSSIBLE_CHARS) {
    rates[char] = 0;
  }
  return rates;
};

const getHighestChar = require('./get-highest-char');

const clean = (rates) => {
  for (let char of POSSIBLE_CHARS) {
    if (char in rates && rates[char] === 0 || isNaN(rates[char])) {
      delete rates[char];
    }
  }
};

const match = require('./match');

module.exports = {
  words: require('fs').readFileSync(require('word-list'), 'utf8').split('\n'),
  initialGuess: function (word) { return this._initialGuess(word.length).toUpperCase(); },
  _initialGuess: function (length) {
    this.rates = Rates();
    this.candidates = this.words.filter((word) => word.length === length && this.remember(word));
    return this.getHighestChar();
  },
  remember: function (word) { for (let char of word) { this.rates[char]++; } return true;  },
  forget:   function (word) { for (let char of word) { this.rates[char]--; } return false; },
  getHighestChar: function () {
    clean(this.rates);
    return this.lastGuess = getHighestChar(this.rates);
  },
  guessWith: function (word) {
    if (this.lastGuess === '') {
      return '';
    }
    delete this.rates[this.lastGuess];
    return this._guessWith(this.lastGuess, word.toLowerCase()).toUpperCase();
  },
  _guessWith: function (char, wordNew) {
    this.candidates = this.candidates.filter((word) => match(char, word, wordNew) || this.forget(word));
    return this.getHighestChar();
  }
};
