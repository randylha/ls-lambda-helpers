class Logger {
  constructor() {
    this.isProduction = process.env.STAGE === 'prod';
    this.logLevelMap = { debug: 3, info: 2, error: 1 };
    this.logLevel = this.setLogLevel();
  }

  setLogLevel() {
    return this.logLevelMap[process.env.LOG_LEVEL];
  }

  debug(...message) {
    if (this.logLevel < 3) {
      return;
    }
    console.log(
      `${process.env.stackName.toUpperCase()}: ${JSON.stringify(message)}`
    );
  }

  debugNoStringify(label, message) {
    if (this.logLevel < 3) {
      return;
    }
    console.log(label, message);
  }

  info(...message) {
    if (this.logLevel < 2) {
      return;
    }
    console.log(
      `${process.env.stackName.toUpperCase()}: ${JSON.stringify(message)}`
    );
  }

  error(...message) {
    if (this.logLevel < 1) {
      return;
    }
    if (message instanceof Error) {
      console.log(message);
    } else {
      console.log(
        `${process.env.stackName.toUpperCase()}: ${JSON.stringify(message)}`
      );
    }
  }

  audit(...message) {
    console.log(
      `${process.env.stackName.toUpperCase()}: ${JSON.stringify(message)}`
    );
  }

  log(...message) {
    if (this.isProduction) {
      return;
    }
    console.log(
      `${process.env.stackName.toUpperCase()}: ${JSON.stringify(message)}`
    );
  }
}

module.exports = Logger;
