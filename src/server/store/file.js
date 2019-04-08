const fs = require('fs');
const log = require('../utils/logger.js').getLogger();

const read = (path) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, (err, buffer) => {
      if (err) {
        log.error(`Could not read file ${path}`);
        reject(err);
        return;
      }
      const parsed = JSON.parse(buffer);
      log.debug(`Retrieved data ${JSON.stringify(parsed)}`);
      resolve(parsed);
    })
  });

module.exports = {
  read,
};
