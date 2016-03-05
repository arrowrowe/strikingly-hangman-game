'use strict';

module.exports = (rates) => {
  let maxChar = '';
  let max = 0;
  for (let char in rates) {
    if (rates[char] > max) {
      max = rates[char];
      maxChar = char;
    }
  }
  return maxChar;
};
