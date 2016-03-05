const shg = require('./index');

if (process.argv.length !== 4) {
  shg.log.error('Usage: npm run debug https://url/ player@email');
  process.exit(1);
}
const PLAYER_URL = process.argv[2];
const PLAYER_ID = process.argv[3];

const player = new shg.player(PLAYER_URL);

const vorpal = require('vorpal')();

vorpal.command('startGame').action(() =>
  player.startGame(PLAYER_ID).then((data) =>
    shg.log.info('startGame', data)
  )
);

vorpal.command('nextWord').action(() =>
  player.nextWord().then((data) =>
    shg.log.info('nextWord', data)
  )
);

vorpal.command('guessWord <guess>').validate((args) =>
  /^[A-Z]$/.test(args.guess) || 'Only one capital letter allowed!'
).action((args) =>
  player.guessWord(args.guess).then((data) =>
    shg.log.info('guessWord', data)
  )
);

vorpal.command('getResult').action(() =>
  player.getResult().then((data) =>
    shg.log.info('getResult', data)
  )
);

vorpal.command('submitResult').action(() =>
  player.submitResult().then((data) =>
    shg.log.info('submitResult', data)
  )
);

vorpal.delimiter(require('./package').name + ' $').show();
