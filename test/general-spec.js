const expect = require('chai').expect;

const shg = require('../index');

describe('The player', () => {
  it('tells its version', () => {
    expect(shg.version).to.match(/^\d+\.\d+\.\d$/);
  });
});
