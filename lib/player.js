'use strict';

const constants = require('./constants');

const player = function (url, playerId) {
  this.url = url;
  this.playerId = playerId;
  this.playerRecordPath = './player.' + this.playerId + '.log';
  this.data = Object.create(null);
  return this;
};

player.prototype.post = require('./interact').post;

player.prototype.startGame = function () {
  return this.post({
    playerId: this.playerId,
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

const fs = require('fs-extra');

player.prototype.submitResult = function () {
  return this.getResult().then((data) => {
    let record;
    try {
      record = fs.readJsonSync(this.playerRecordPath);
    } catch (err) {
      record = {score: 0};
    }
    if (data.score <= record.score) {
      throw constants.ERROR_SCORE_TOO_LOW;
    }
    fs.writeJsonSync(this.playerRecordPath, data);
    return this.post({
      sessionId: this.data.sessionId,
      action: 'submitResult'
    });
  }).then((response) => {
    return response.data;
  });
};

const automate = require('./automate');

player.prototype.run = function () {
  return automate.run(this);
};

module.exports = player;
