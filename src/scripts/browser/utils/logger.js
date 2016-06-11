import colors from 'colors/safe';

function getCleanISODate () {
  return new Date().toISOString().replace(/[TZ]/g, ' ').trim();
}

export function printDebug () {
  if (global.options.consoleLogs) {
    console.log(...arguments);
  }
  const fileLogger = require('browser/utils/file-logger');
  fileLogger.writeLog(`DEBUG [${getCleanISODate()}]`, ...arguments);
}

export function printError (namespace, isFatal, err) {
  const errorPrefix = `${isFatal ? 'FATAL' : 'ERROR'} [${getCleanISODate()}]   ${namespace}:`;
  if (global.options.consoleLogs) {
    if (isFatal) {
      console.error(colors.white.bold.bgMagenta(errorPrefix), err);
    } else {
      console.error(colors.white.bold.bgRed(errorPrefix), err);
    }
  }
  const fileLogger = require('browser/utils/file-logger');
  fileLogger.writeLog(errorPrefix, err);
}
