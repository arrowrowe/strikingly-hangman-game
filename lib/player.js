const player = function (url) {
  this.url = url;
  this.data = Object.create(null);
  return this;
};

player.prototype.post = require('./interact').post;

player.prototype.startGame = function (playerId) {
  return this.post({
    playerId,
    action: 'startGame'
  }).then((response) => {
    this.data.numberOfWordsToGuess = response.data.numberOfWordsToGuess;
    this.data.numberOfGuessAllowedForEachWord = response.data.numberOfGuessAllowedForEachWord;
    this.data.sessionId = response.sessionId;
    return response;
  });
};

player.prototype.nextWord = function () {
  return this.post({
    sessionId: this.data.sessionId,
    action: 'nextWord'
  }).then((response) => {
    return response.data;
  });
};

player.prototype.guessWord = function (guess) {
  return this.post({
    sessionId: this.data.sessionId,
    action: 'guessWord',
    guess
  }).then((response) => {
    return response.data;
  });
};

player.prototype.getResult = function () {
  return this.post({
    sessionId: this.data.sessionId,
    action: 'getResult'
  }).then((response) => {
    return response.data;
  });
};

player.prototype.submitResult = function () {
  return this.post({
    sessionId: this.data.sessionId,
    action: 'submitResult'
  }).then((response) => {
    return response.data;
  });
};

module.exports = player;
