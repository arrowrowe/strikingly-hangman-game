function session(playerId) {
  this.id = 'some-fake-session-id';
  this.totalWordCount = 0;
  this.wrongGuessCountOfCurrentWord = 0;
  this.word = '';
  this.correctWordCount = 0;
  this.totalWrongGuessCount = 0;
  this.score = 0;
  this.playerId = playerId;
  return this;
}

module.exports = {
  config: {
    numberOfWordsToGuess: 80,
    numberOfGuessAllowedForEachWord: 10
  },
  session: Object.create(null),
  error: null,
  handle: function (body) {
    if (this.error !== null) {
      throw this.error;
    }
    return this[body.action](body);
  },
  startGame: function (body) {
    this.session = new session(body.playerId);
    return {
      message: 'THE GAME IS ON',
      sessionId: this.session.id,
      data: {
        numberOfWordsToGuess: this.config.numberOfWordsToGuess,
        numberOfGuessAllowedForEachWord: this.config.numberOfGuessAllowedForEachWord
      }
    };
  },
  nextWord: function () {
    return {
      sessionId: this.session.id,
      data: {
        word: '*****',
        totalWordCount: this.session.totalWordCount,
        wrongGuessCountOfCurrentWord: this.session.wrongGuessCountOfCurrentWord
      }
    };
  },
  guessWord: function () {
    return {
      sessionId: this.session.id,
      data: {
        word: this.session.word,
        totalWordCount: this.session.totalWordCount,
        wrongGuessCountOfCurrentWord: this.session.wrongGuessCountOfCurrentWord
      }
    };
  },
  getResult: function () {
    return {
      sessionId: this.session.id,
      data: {
        totalWordCount: this.session.totalWordCount,
        correctWordCount: this.session.correctWordCount,
        totalWrongGuessCount: this.session.totalWrongGuessCount,
        score: this.session.score
      }
    };
  },
  submitResult: function () {
    return {
      message: 'GAME OVER',
      sessionId: this.session.id,
      data: {
        playerId: this.session.playerId,
        sessionId: this.session.id,
        totalWordCount: this.session.totalWordCount,
        correctWordCount: this.session.correctWordCount,
        totalWrongGuessCount: this.session.totalWrongGuessCount,
        score: this.session.score,
        datetime: new Date().toLocaleString()
      }
    };
  }
};
