const Logger = require('./src/logger');
const SFMC = require('./src/maketingCloud');
const getSecret = require('./src/secretsHelper');
const Encryption = require('./src/encryption');

module.exports = {Logger, Encryption, SFMC, getSecret};