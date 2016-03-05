const log = require('./log');

const interact = module.exports = {
  rp: require('request-promise').defaults({
    headers: {
      'content-type': 'application/json'
    },
    json: true
  }),
  retryCountLimit: 10,
  post: function (body, retryCount) {
    if (retryCount >= interact.retryCountLimit) {
      return Promise.reject({
        message: 'Retry count ' + retryCount + ' exceeds limit ' + interact.retryCountLimit
      });
    }
    return interact.rp.post(this.url, {
      body
    }).catch((reason) => {
      log.error(reason.error && reason.error.message || reason);
      return this.post(body, (retryCount || 0) + 1);
    });
  }
};
