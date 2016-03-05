const expect = require('chai').expect;

module.exports = (fn, verb) => {
  verb = verb || 'equal';
  return function (expected) {
    expect(fn.apply(null, Array.from(arguments).slice(1))).to[verb](expected);
  };
};
