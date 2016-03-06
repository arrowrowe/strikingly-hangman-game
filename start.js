const shg = require('./index');

if (process.argv.length !== 4) {
  shg.log.error('Usage: npm start https://url/ player@email');
  process.exit(1);
}
const PLAYER_URL = process.argv[2];
const PLAYER_ID = process.argv[3];

const player = new shg.player(PLAYER_URL, PLAYER_ID);

player.run().then((data) => {
  shg.log.info('run', data);
  process.exit(0);
});
