const patchouli = require('./patchouli');
const isSolved = require('./is-solved');
const log = require('./log');

module.exports = {
  run: function (player) {
    this.player = player;
    return this.guess(this.player.startGame().then((response) => {
      log.info('startGame [%s] %s', response.sessionId, response.message);
      log.info('Guess %d words with %d allowance each', response.data.numberOfWordsToGuess, response.data.numberOfGuessAllowedForEachWord);
      return this.player.nextWord();
    }), true);
  },
  guess: function (prom, isInitial) {
    return prom.then((data) => {
      log.info(
        '[%d/%d][%d/%d] %s -> "%s"',
        data.totalWordCount, this.player.data.numberOfWordsToGuess,
        data.wrongGuessCountOfCurrentWord, this.player.data.numberOfGuessAllowedForEachWord,
        isInitial ? 'nextWord' : 'guessWord',
        data.word
      );
      if (data.wrongGuessCountOfCurrentWord >= this.player.data.numberOfGuessAllowedForEachWord) {
        log.info('Guess limit for current word exceeded');
        return this.giveUp(data);
      }
      const word = data.word;
      if (isSolved(word)) {
        log.info('Already solved!');
        return this.giveUp(data);
      }
      const guess = isInitial ? patchouli.initialGuess(word) : patchouli.guessWith(word);
      if (!guess) {
        log.info('Cannot guess');
        return this.giveUp(data);
      }
      log.info('Guess "%s"', guess);
      return this.guess(this.player.guessWord(guess));
    });
  },
  giveUp: function (data) {
    if (data.totalWordCount >= this.player.data.numberOfWordsToGuess) {
      log.info('Try to submit');
      return this.player.submitResult();
    }
    log.info('Request next word');
    return this.guess(this.player.nextWord(), true);
  }
};
