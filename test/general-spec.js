const expect = require('chai').expect;
const stub = require('sinon').stub;

const shg = require('../index');
const interact = require('../lib/interact');
const fakeServer = require('./fake-server');

describe('The player', () => {

  before(() => {
    shg.log.setLevel('OFF');
    stub(interact.rp, 'post', (url, option) => {
      const body = option.body;
      try {
        return Promise.resolve(fakeServer.handle(body));
      } catch (err) {
        return Promise.reject(err);
      }
    });
  });

  after(() => {
    shg.log.setLevel('ALL');
    interact.rp.post.restore();
  });

  it('tells its version', () => {
    expect(shg.version).to.match(/^\d+\.\d+\.\d$/);
  });

  it('is capable of basic interactions', () => {
    const player = new shg.player('some-server-url', 'some-player-id');
    return player.startGame().then((response) => {
      expect(response.data).to.have.all.keys(['numberOfWordsToGuess', 'numberOfGuessAllowedForEachWord']);
      return player.nextWord();
    }).then((response) => {
      expect(response).to.have.all.keys(['word', 'totalWordCount', 'wrongGuessCountOfCurrentWord']);
      return player.guessWord('E');
    }).then((response) => {
      expect(response).to.have.all.keys(['word', 'totalWordCount', 'wrongGuessCountOfCurrentWord']);
      return player.getResult();
    }).then((response) => {
      expect(response).to.have.all.keys(['totalWordCount', 'correctWordCount', 'totalWrongGuessCount', 'score']);
      return player.submitResult();
    }).then((response) => {
      expect(response).to.have.all.keys(['playerId', 'sessionId', 'totalWordCount', 'correctWordCount', 'totalWrongGuessCount', 'score', 'datetime']);
    });
  });

  const THandleError = (error, pattern) => {
    pattern = pattern || /exceeds limit/;
    fakeServer.error = error;
    const player = new shg.player('some-server-url');
    return player.startGame('some-player-id').catch((reason) => {
      fakeServer.error = null;
      expect(reason.message || reason).to.match(pattern);
    });
  };

  it('throws known errors immediately', () => THandleError({error: {message: 'Missing session id'}}, /Missing session id/));
  it('retries until limit exceeded', () => THandleError({error: {message: 'Some error messaage.'}}));
  it('handles unrecogonized errors as well', () => THandleError('Some strange error'));

});
