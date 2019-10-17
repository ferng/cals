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

const write = (path, data) =>
  new Promise((resolve, reject) => {
    let stringified = JSON.stringify(data);
    fs.writeFile(path, stringified, (err, buffer) => {
      if (err) {
        log.error(`Could not write to file ${path}`);
        reject(err);
        return;
      }
      log.debug(`Saved data ${stringified}`);
      resolve();
    })
  });

module.exports = {
  read,
  write,
};
