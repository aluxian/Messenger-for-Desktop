import colors from 'colors/safe';

export function printDebug() {
  console.log(...arguments);
  const fileLogger = require('./file-logger');
  fileLogger.writeLog(...arguments);
}

export function printError(namespace, isFatal, ex) {
  const errorPrefix = `[${new Date().toUTCString()}] ${namespace}:`;
  if (isFatal) {
    console.error(colors.white.bold.bgMagenta(errorPrefix), ex);
  } else {
    console.error(colors.white.bold.bgRed(errorPrefix), ex);
  }
  const fileLogger = require('./file-logger');
  fileLogger.writeLog(errorPrefix, ex);
}
