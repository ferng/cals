const express = require('express');
const bodyParser = require('body-parser');
const routeCals = require('./src/server/routes/cals.js');
const log = require('./src/server/utils/logger.js').getLogger();
const config = require('./config.json');
const path = require('path');
const app = express();

// requests
function requestHandler(req, res, next) {
  log.debug('Inbound request:', req.method, req.originalUrl);
  res.setHeader('Access-Control-Allow-Origin', config.app.base_url);
//   res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT');
  res.setHeader('Cache-Control', 'no-cache');
  next();
}

function requestPage(req, res) {
  log.debug('Inbound page request:', req.method, req.originalUrl);
  res.sendFile(`${__dirname}/${config.app.deploy_dir}/index.html`);
}

function update(req, res) {
  log.debug('Inbound page request:', req.method, req.originalUrl);
}

// initialize app server
app.set('port', config.app.port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:  false }));
app.use('/', express.static(`${__dirname}/${config.app.deploy_dir}`));
app.use(requestHandler);
app.use(`/${config.app.cals_url}`, routeCals);
app.get('*', requestPage); 
app.listen(app.get('port'));

log.info(`Server started: ${config.app.base_url}`);
