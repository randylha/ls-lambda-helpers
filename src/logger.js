/* eslint class-methods-use-this: ["error", { "exceptMethods": ["audit"] }] */

class Logger {
  constructor() {
    this.isProduction = process.env.stage === 'prod';
    this.logLevelMap = { debug: 3, info: 2, error: 1 };
    this.logLevel = this.setLogLevel();
  }

  setLogLevel() {
    return this.logLevelMap[process.env.logLevel];
  }

  debug(...message) {
    if (this.logLevel < 3) {
      return;
    }
    console.debug(
      `${process.env.stackName.toUpperCase()}: ${JSON.stringify(message)}`,
    );
  }

  debugNoStringify(label, message) {
    if (this.logLevel < 3) {
      return;
    }
    console.debug(label, message);
  }

  info(...message) {
    if (this.logLevel < 2) {
      return;
    }
    console.info(
      `${process.env.stackName.toUpperCase()}: ${JSON.stringify(message)}`,
    );
  }

  error(...message) {
    if (this.logLevel < 1) {
      return;
    }
    if (message instanceof Error) {
      console.error(message);
    } else {
      console.error(
        `${process.env.stackName.toUpperCase()}: ${JSON.stringify(message)}`,
      );
    }
  }

  audit(...message) {
    console.log(
      `${process.env.stackName.toUpperCase()}: ${JSON.stringify(message)}`,
    );
  }

  log(...message) {
    if (this.isProduction) {
      return;
    }
    console.log(
      `${process.env.stackName.toUpperCase()}: ${JSON.stringify(message)}`,
    );
  }
}

module.exports = { Logger };
