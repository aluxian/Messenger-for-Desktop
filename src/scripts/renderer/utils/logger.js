import remote from 'remote';
import debug from 'debug';
import util from 'util';

const browserLogger = remote.require('../browser/utils/logger');
const {namespaceOfFile, anonymizeException, trimLongPaths} = browserLogger;

// Fix for debug formatting
process.env.DEBUG_COLORS = true;

export function debugLogger(filename) {
  let logger = null;
  return function() {
    if (!logger) {
      logger = debug(namespaceOfFile(filename));
    }
    logger.log = function() {
      browserLogger.printDebug(...arguments);
    };
    logger(util.format(...arguments));
  };
}

function reportToPiwik(namespace, isFatal, ex) {
  const piwik = require('./piwik').getTracker();
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
  const sentry = require('./sentry').default;
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

export function errorLogger(filename, isFatal) {
  let namespace = null;
  return function(ex) {
    if (!namespace) {
      namespace = namespaceOfFile(filename);
    }

    if (!(ex instanceof Error)) {
      ex = new Error(ex);
    }

    browserLogger.printError(namespace, util.format(ex));
    reportToPiwik(namespace, isFatal, ex);
    reportToSentry(namespace, isFatal, ex);
  };
}
