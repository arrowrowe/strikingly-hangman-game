const shg = require('./index');
const isSolved = require('./lib/is-solved');

if (process.argv.length !== 4) {
  shg.log.error('Usage: npm run debug https://url/ player@email');
  process.exit(1);
}
const PLAYER_URL = process.argv[2];
const PLAYER_ID = process.argv[3];

const player = new shg.player(PLAYER_URL, PLAYER_ID);

// HACK: Prevent Vorpal's error output for promises
const isErrorKnown = require('./lib/interact').isErrorKnown;
const Command = require('./node_modules/vorpal/dist/command');
Command.prototype.actionWrap = function (fn) {
  this.action((args) => fn(args).catch((reason) => isErrorKnown(reason) || shg.log.error(reason)));
};

const vorpal = require('vorpal')();

vorpal.command('startGame').actionWrap(() =>
  player.startGame().then((data) =>
    shg.log.info('startGame', data)
  )
);

vorpal.command('nextWord').actionWrap(() =>
  player.nextWord().then((data) => {
    shg.log.info('nextWord', data);
    shg.log.info('Patchouli suggests', shg.patchouli.initialGuess(data.word));
  })
);

vorpal.command('guessWord <guess>').validate((args) =>
  /^[A-Z]$/.test(args.guess) || 'Only one capital letter allowed!'
).actionWrap((args) =>
  player.guessWord(args.guess).then((data) => {
    shg.log.info('guessWord', data);
    const word = data.word;
    if (isSolved(word)) {
      shg.log.info('Correct!');
    } else {
      shg.patchouli.lastGuess = args.guess.toLowerCase();
      const suggestion = shg.patchouli.guessWith(word);
      if (suggestion) {
        shg.log.info('Patchouli suggests', suggestion);
      } else {
        shg.log.info('Patchouli gives up.');
      }
    }
  })
);

vorpal.command('getResult').actionWrap(() =>
  player.getResult().then((data) =>
    shg.log.info('getResult', data)
  )
);

vorpal.command('submitResult').actionWrap(() =>
  player.submitResult().then((data) =>
    shg.log.info('submitResult', data)
  )
);

vorpal.command('run').actionWrap(() =>
  player.run().then((data) =>
    shg.log.info('run', data)
  )
);

vorpal.delimiter(require('./package').name + ' $').show();
