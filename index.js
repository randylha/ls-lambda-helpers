const logger = require('./src/logger');
const sfmcDE = require('./src/maketingCloud');
const getSecrect = require('./src/secretsHelper');

module.exports = {...logger, sfmcDE, getSecrect};