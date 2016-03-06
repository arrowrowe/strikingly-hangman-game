'use strict';

const patchouli = require('./patchouli');
const isSolved = require('./is-solved');
const log = require('./log');
const ProgressBar = require('progress');
const chalk = require('chalk');
const padding = require('./padding');

module.exports = {
  run: function (player) {
    this.player = player;
    return this.guess(this.player.startGame().then((response) => {
      this.progress = {
        solved: 0,
        lastWrong: 0
      };
      log.info('startGame [%s] %s', response.sessionId, response.message);
      log.info('Guess %d words with %d allowance each', response.data.numberOfWordsToGuess, response.data.numberOfGuessAllowedForEachWord);
      return this.player.nextWord();
    }), true);
  },
  update: function (data, correct) {
    let word = data.word;
    let failed = data.totalWordCount - this.progress.solved - 1;
    if (correct) {
      this.progress.solved++;
      word = chalk.green(word);
    } else if (correct === false) {
      failed++;
      word = chalk.red(word);
    }
    this.currentBar.tick(data.wrongGuessCountOfCurrentWord - this.progress.lastWrong, {
      solved: padding(this.progress.solved, this.player.data.numberOfWordsToGuess),
      failed: padding(failed, this.player.data.numberOfWordsToGuess),
      passed: padding(data.totalWordCount, this.player.data.numberOfWordsToGuess),
      all: this.player.data.numberOfWordsToGuess,
      word
    });
    this.progress.lastWrong = data.wrongGuessCountOfCurrentWord;
    if (correct !== undefined && data.wrongGuessCountOfCurrentWord < this.player.data.numberOfGuessAllowedForEachWord) {
      process.stdout.write('\n');
    }
  },
  guess: function (prom, isInitial) {
    return prom.then((data) => {
      if (isInitial) {
        this.currentBar = new ProgressBar('[:solved : :failed / :passed / ' + this.player.data.numberOfWordsToGuess + '][:bar] :word', {
          width: this.player.data.numberOfGuessAllowedForEachWord,
          total: this.player.data.numberOfGuessAllowedForEachWord,
          complete: 'x',
          incomplete: ' '
        });
        this.progress.lastWrong = 0;
      }
      if (data.wrongGuessCountOfCurrentWord >= this.player.data.numberOfGuessAllowedForEachWord) {
        return this.giveUp(data);
      }
      const word = data.word;
      if (isSolved(word)) {
        return this.giveUp(data, true);
      }
      const guess = isInitial ? patchouli.initialGuess(word) : patchouli.guessWith(word);
      if (!guess) {
        return this.giveUp(data);
      }
      this.update(data);
      return this.guess(this.player.guessWord(guess));
    });
  },
  giveUp: function (data, correct) {
    this.update(data, !!correct);
    if (data.totalWordCount >= this.player.data.numberOfWordsToGuess) {
      log.info('Try to submit');
      return this.player.submitResult();
    }
    return this.guess(this.player.nextWord(), true);
  }
};
