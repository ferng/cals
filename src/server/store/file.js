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
      log.debug(`Retrieved data ${buffer}`);
      resolve(JSON.parse(buffer));
    })
  });

module.exports = {
  read,
};
