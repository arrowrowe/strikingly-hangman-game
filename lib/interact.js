const log = require('./log');

const interact = module.exports = {
  rp: require('request-promise').defaults({
    headers: {
      'content-type': 'application/json'
    },
    json: true
  }),
  retryCountLimit: 10,
  isErrorKnown: (message) => typeof message === 'string' && [
    'Missing session id',
    'You are not following the game flow',
    'No more guess left.',
    'No more word to guess'
  ].indexOf(message) >= 0,
  post: function (body, retryCount) {
    if (retryCount >= interact.retryCountLimit) {
      return Promise.reject({
        message: 'Retry count ' + retryCount + ' exceeds limit ' + interact.retryCountLimit
      });
    }
    return interact.rp.post(this.url, {
      body
    }).catch((reason) => {
      const message = reason.error && reason.error.message || reason;
      log.error(message);
      if (interact.isErrorKnown(message)) {
        throw message;
      }
      return this.post(body, (retryCount || 0) + 1);
    });
  }
};
