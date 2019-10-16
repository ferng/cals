const express = require('express');
const bodyParser = require('body-parser');
const routeCals = require('./src/server/routes/cals.js');
const log = require('./src/server/utils/logger.js').getLogger();
const config = require('./config.js');
const path = require('path');
const app = express();

// requests
function requestHandler(req, res, next) {
  log.debug('Inbound request:', req.method, req.originalUrl);
  res.setHeader('Access-Control-Allow-Headers','*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Cache-Control', 'no-cache');
  next();
}

function requestPage(req, res) {
  log.debug('Inbound page request:', req.method, req.originalUrl);
  res.sendFile(`${__dirname}/index.html`);
}

function update(req, res) {
  console.log(req);
}

// initialize app server
app.set('port', config.cals.port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:  false }));
app.use('/', express.static(__dirname));
app.use(requestHandler);
app.use('/api/cals', routeCals);
app.get('*', requestPage); 
app.listen(app.get('port'));

log.info('Server started: http://localhost: {}/', app.get('port'));
