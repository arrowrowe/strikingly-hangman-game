'use strict';

function session(playerId, config) {
  this.id = 'some-fake-session-id';
  this.config = config;
  this.totalWordCount = 0;
  this.wrongGuessCountOfCurrentWord = 0;
  this.words = ['AA', 'BB', 'EE', 'FF', 'A', 'Z'];
  this.word = '';
  this.wordReal = '';
  this.correctWordCount = 0;
  this.totalWrongGuessCount = 0;
  this.score = 0;
  this.playerId = playerId;
  return this;
}

session.prototype.response = function (data, message) {
  const response = {sessionId: this.id, data};
  if (message) {
    response.message = message;
  }
  return response;
};

session.prototype.startGame = function () {
  return this.response({
    numberOfWordsToGuess: this.config.numberOfWordsToGuess,
    numberOfGuessAllowedForEachWord: this.config.numberOfGuessAllowedForEachWord
  }, 'THE GAME IS ON');
};

session.prototype.nextWord = function () {
  this.wrongGuessCountOfCurrentWord = 0;
  this.wordReal = this.words[this.totalWordCount];
  this.word = '*'.repeat(this.wordReal.length);
  this.totalWordCount++;
  return this.response({
    word: this.word,
    totalWordCount: this.totalWordCount,
    wrongGuessCountOfCurrentWord: this.wrongGuessCountOfCurrentWord
  });
};

function addMatch(guess, word, wordReal) {
  let wordNew = '';
  for (let i in wordReal) {
    wordNew += guess === wordReal[i] ? guess : word[i];
  }
  return wordNew;
}

session.prototype.guessWord = function (body) {
  const wordNew = addMatch(body.guess, this.word, this.wordReal);
  if (wordNew === this.word) {
    this.wrongGuessCountOfCurrentWord++;
  } else {
    this.word = wordNew;
  }
  return this.response({
    word: this.word,
    totalWordCount: this.totalWordCount,
    wrongGuessCountOfCurrentWord: this.wrongGuessCountOfCurrentWord
  });
};

session.prototype.getResult = function () {
  return {
    sessionId: this.id,
    data: {
      totalWordCount: this.totalWordCount,
      correctWordCount: this.correctWordCount,
      totalWrongGuessCount: this.totalWrongGuessCount,
      score: this.score
    }
  };
};

session.prototype.submitResult = function () {
  return this.response({
    playerId: this.playerId,
    sessionId: this.id,
    totalWordCount: this.totalWordCount,
    correctWordCount: this.correctWordCount,
    totalWrongGuessCount: this.totalWrongGuessCount,
    score: this.score,
    datetime: new Date().toLocaleString()
  }, 'GAME OVER');
};

module.exports = {
  config: {
    numberOfWordsToGuess: 6,
    numberOfGuessAllowedForEachWord: 5
  },
  session: Object.create(null),
  error: null,
  handle: function (body) {
    if (this.error !== null) {
      throw this.error;
    }
    if (body.action === 'startGame') {
      this.session = new session(body.playerId, this.config);
    }
    return this.session[body.action](body);
  }
};
