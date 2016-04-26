import colors from 'colors/safe';

export function printDebug() {
  console.log(...arguments);
  const fileLogger = require('./file-logger');
  fileLogger.writeLog(...arguments);
}

export function printError(namespace, ex) {
  const errorPrefix = `[${new Date().toUTCString()}] ${namespace}:`;
  console.error(colors.white.bold.bgRed(errorPrefix), ex);
  const fileLogger = require('./file-logger');
  fileLogger.writeLog(errorPrefix, ex);
}
