# Strikingly's Hangman Game (A Node.js Player)

> Strikingly Task2 - JavaScript Programming Test

Contact me ([arrowrowe@gmail.com](mailto:arrowrowe@gmail.com)) to get acess to this GitHub private repository: [arrowrowe/strikingly-hangman-game](https://github.com/arrowrowe/strikingly-hangman-game).

[npm:word-list]: https://www.npmjs.com/package/word-list
[npm:subtlex-word-frequencies]: https://www.npmjs.com/package/subtlex-word-frequencies
[npm:commander]: https://www.npmjs.com/package/commander

## Usage

```
# Install
$ npm install     # Latest stable Node required, as ES6 is used.

# A interactive cli. It supports autocomplete!
$ npm run debug http://www.domain-name.com/game/on YOUR_EMAIL
# You know what following commands do.
strikingly-hangman-game $ startGame
strikingly-hangman-game $ nextWord
strikingly-hangman-game $ guessWord E
strikingly-hangman-game $ getResult
strikingly-hangman-game $ submitResult
# Start a new game and run automatically!
strikingly-hangman-game $ run
# Now exit this cli.
strikingly-hangman-game $ exit

# Simply make it run automatically. Note: it throws an error if attempting to submit a low score. Never mind that.
$ npm start http://www.domain-name.com/game/on YOUR_EMAIL
```

## What does each JS do?

- `lib/player.js` interacts with Server, calling `lib/interact.js`.
- `lib/automate.js` implements a auto-play strategy, i.e. a startWord-then-nextWord-and-guessWord-finally-submitResult loop.
- `lib/patchouli.js` knows a lot of words (thanks to [word-list][npm:word-list]). Each time `nextWord` or `guessWord` gives a feedback, Patchouli guesses again:
  - first she filters out impossible words,
  - then the character which appears the most times in all candidates can be found.
- Each of the following is just one function or object:
  - `lib/constants.js` records necessary constants.
  - `lib/get-highest-char.js` finds the most common character, given all characters' frequencies.
  - `lib/is-solved.js` detects if a word puzzle is already solved.
  - `lib/log.js` is a simple logger.
  - `lib/match.js` checks if two words (may includes `'*'`) match with each other considering a given character.
  - `lib/padding.js` is for better cli output.

## Test

```
$ npm test
```

## Possible Improvements

Following Improvements can be made to achieve better result and performance if more time provided.

- Use [subtlex-word-frequencies][npm:subtlex-word-frequencies] instead of [word-list][npm:word-list], taking words' frequencies into considerations.
- Refactor commandline processing part, using [commander][npm:commander] or similar libraries.
- More friendly cli (the one launched by `npm run debug`).
- Better commandline output for automatically playing, e.g. a progress bar like `[vvvvv__xxx]` representing 5 solved and 3 failed among all 10 puzzles.

## Result

Current highest score is
- 1310.
