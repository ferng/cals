const config = {};

// server
config.cals = {};
config.cals.data= './cals.';

// logger
config.logger = {};
config.logger.appname = 'cals';
config.logger.file_name = 'cals.log.json';
config.logger.file_level = 'trace';
config.logger.console_level = 'trace';

module.exports = config;
