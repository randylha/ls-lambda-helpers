# ls-lambda-helpers
![GitHub package.json version](https://img.shields.io/github/package-json/v/jacobcravinho/ls-lambda-helpers)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/jacobcravinho/ls-lambda-helpers?color=green)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/jacobcravinho/ls-lambda-helpers)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/jacobcravinho/ls-lambda-helpers/npm-publish)

Helpers used to aid in rapid developemnet and coding consistentcy.
## Install
    npm install ls-lambda-helpers

## Helpers

<!-- Logger -->
<details><summary><b>Logger</b></summary>
<p>

### Description
Create log levels between environments

* console.debug() - If log level is set to debug, it will log everything.
* console.info() - If log level is set to info, it will log info and error.
* console.error() - If log level is set to error, it will only log error.
* console.audit() - If log level is set to audit, it will log no matter the level or stage.
* console.log() is overwritten so that if the stage is Production it will NOT log. This prevents sensitive information from ending up in the logs
### Setup
#### serverless.yml
```yaml
service: service-name
custom:
    logLevel:
        dev: 'debug'
        qa: 'info'
        preprod: 'info'
        prod: 'error'
provider:
    environment:
        STAGE: ${self:provider.stage}
        LOG_EVEL: ${self:custom.logLevel.${self:provider.stage}}
```
** Note: If you do not need custom level for each stage and only want to override PROD then only include `STAGE: ${self:provider.stage}`

#### file.js
```js
const { Logger } = require('ls-lambda-helpers');
const console = new Logger();

exports.handler = async (event, context) => { 
  console.info("Event", event);
  console.audit("Context", context);
}
```

</p>
</details>


<!-- SFMC Data Endpoints -->
<details><summary><b>SFMC Data Endpoints</b></summary>
<p>

### Description
Handles authentication and calling to SalesForce Marketing Cloud DataExtension

### Setup
You must use AWS SecretesManager to store your credentials.  Please store creds in the following format: `clientId:{ID}, clientSecret:{SECRET}`
#### serverless.yml
```yaml
service: service-name
provider:
    environment:
        SFMC_SECRET_NAME: name-of-secret
```

#### file.js
```js
const { SFMC } = require('ls-lambda-helpers');
// This is the string after key:
const {SFMC_URL_METHOD} = process.env;

exports.handler = async (event, context) => { 
  const postRes = await SFMC.postAPI(SFMC_URL_METHOD, {items:[{item1:'value1', item2:'value2'}]});
        console.log('POST RES:', postRes);
}
```
</p>
</details>