import util from 'util';

function anonymizeException(ex) {
  const app = require('common/electron/app').default;
  ex.message = ex.message.replace(app.getPath('home'), '<home>');
}

function trimLongPaths(ex) {
  const app = require('common/electron/app').default;
  ex.stack = ex.stack
    .split('\n')
    .map(line => line.replace(/\/.+atom\.asar/, 'atom.asar'))
    .map(line => line.replace(app.getAppPath(), 'app'))
    .join('\n');
}

function namespaceOfFile(filename) {
  const app = require('common/electron/app').default;
  let name = filename.replace(app.getAppPath(), '').replace('.js', '');
  if (name[0] == '/') {
    name = name.substr(1);
  }
  return global.manifest.name + ':' + name;
}

function reportToPiwik(namespace, isFatal, ex) {
  const piwik = require('common/services/piwik').default.getTracker();
  if (piwik) {
    piwik.trackEvent(
      'Exceptions',
      isFatal ? 'Fatal Error' : 'Error',
      ex.name,
      `[${namespace}]: ${ex.message}`
    );
  }
}

function reportToSentry(namespace, isFatal, ex) {
  const sentry = require('common/services/sentry').default;
  if (sentry) {
    anonymizeException(ex);
    trimLongPaths(ex);

    console.log('reporting to sentry:', ex);
    sentry.captureException(ex, {
      level: isFatal ? 'fatal' : 'error',
      extra: {
        trace: new Error().stack
      },
      tag: {
        namespace: namespace
      }
    }, function(result) {
      console.log('reported to sentry:', result);
    });
  }
}

export function debugLogger(filename) {
  let logger = null;
  return function() {
    if (!logger) {
      const debug = require('common/modules/debug').default;
      logger = debug(namespaceOfFile(filename));
    }
    const browserLogger = require('common/utils/logger-browser').default;
    logger.log = browserLogger.printDebug;
    logger(util.format(...arguments));
  };
}

export function errorLogger(filename, isFatal) {
  let namespace = null;
  return function(ex) {
    if (!namespace) {
      namespace = namespaceOfFile(filename);
    }

    if (!(ex instanceof Error)) {
      ex = new Error(ex);
    }

    const browserLogger = require('common/utils/logger-browser').default;
    browserLogger.printError(namespace, util.format(ex));

    reportToPiwik(namespace, isFatal, ex);
    reportToSentry(namespace, isFatal, ex);
  };
}
