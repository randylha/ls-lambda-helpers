const Logger = require('./src/logger');
const SFMC = require('./src/maketingCloud');
const Secrets = require('./src/secretsHelper');
const Encryption = require('./src/encryption');
const DDQ = require('./src/ddqAuth');

module.exports = {Logger, Encryption, SFMC, Secrets, DDQ};