const logger = require('./src/logger');
const sfmcDE = require('./src/maketingCloud');
const getSecret = require('./src/secretsHelper');

module.exports = {...logger, sfmcDE, getSecret};