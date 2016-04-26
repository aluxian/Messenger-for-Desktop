import debug from 'debug/browser';
import remote from 'remote';

const browserLogger = remote.require('../browser/utils/logger');
const {namespaceOfFile, anonymizeException, trimLongPaths} = browserLogger;
const browserDebugLogger = browserLogger.debugLogger;
const browserErrorLogger = browserLogger.errorLogger;

export function debugLogger(filename) {
  let browserLogger = null;
  let namespace = null;
  let logger = null;
  return function() {
    if (!browserLogger) {
      browserLogger = browserDebugLogger(filename);
    }

    if (!namespace) {
      namespace = namespaceOfFile(filename);
    }

    if (!logger) {
      logger = debug(namespace);
    }

    logger(...arguments);
    browserLogger(...arguments);
  };
}

export function logDebugFromRenderer(namespace) {
  debugLogger(namespace, false)(...arguments);
}

export function logErrorFromRenderer(namespace, isFatal, ex) {
  errorLogger(namespace, isFatal, false)(ex);
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
  let browserLogger = null;
  let namespace = null;
  return function(ex) {
    if (!browserLogger) {
      browserLogger = browserErrorLogger(filename, isFatal, true);
    }

    if (!namespace) {
      namespace = namespaceOfFile(filename);
    }

    if (!(ex instanceof Error)) {
      ex = new Error(ex);
    }

    if (ex.__skip_console_log) {
      delete ex.__skip_console_log;
    } else {
      delete ex.__skip_console_log;
      const errorPrefix = `[${new Date().toUTCString()}] ${namespace}:`;
      console.error(errorPrefix, ...arguments);
    }

    browserLogger(ex);
    reportToPiwik(namespace, isFatal, ex);
    reportToSentry(namespace, isFatal, ex);
  };
}
