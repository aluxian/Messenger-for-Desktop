import colors from 'colors/safe';

export function printDebug() {
  console.log(...arguments);
  const fileLogger = require('browser/utils/file-logger');
  fileLogger.writeLog(...arguments);
}

export function printError(namespace, isFatal, err) {
  const errorPrefix = `[${new Date().toUTCString()}] ${namespace}:`;
  if (isFatal) {
    console.error(colors.white.bold.bgMagenta(errorPrefix), err);
  } else {
    console.error(colors.white.bold.bgRed(errorPrefix), err);
  }
  const fileLogger = require('browser/utils/file-logger');
  fileLogger.writeLog(errorPrefix, err);
}
