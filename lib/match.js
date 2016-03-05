'use strict';

module.exports = (char, word, wordNew) => {
  for (let i in word) {
    if ((word[i] === char) !== (wordNew[i] === char)) {
      return false;
    }
  }
  return true;
};
