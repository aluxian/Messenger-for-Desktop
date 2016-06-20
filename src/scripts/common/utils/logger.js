import util from 'util';
import path from 'path';

import eventCategories from 'common/analytics/categories';
import eventActions from 'common/analytics/actions';
import eventNames from 'common/analytics/names';

function anonymizeException (err) {
  const app = require('common/electron/app').default;
  err.message = err.message.replace(app.getPath('home'), '<home>');
}

// function trimLongPaths (err) {
//   const app = require('common/electron/app').default;
//   err.stack = err.stack
//     .split('\n')
//     .map((line) => line.replace(/\/.+atom\.asar/, 'atom.asar'))
//     .map((line) => line.replace(app.getAppPath(), 'app'))
//     .join('\n');
// }

function namespaceOfFile (filename) {
  const app = require('common/electron/app').default;
  const appPath = path.join(app.getAppPath(), 'scripts') + '/';

  const appPathNorm = path.posix.normalize(appPath);
  const filenameNorm = path.posix.normalize(filename);

  let name = filenameNorm.replace(appPathNorm, '').replace('.js', '');
  if (name.startsWith('common/')) {
    name += ':' + process.type;
  }

  return global.manifest.name + ':' + name;
}

function reportToPiwik (namespace, isFatal, err) {
  const piwik = require('common/services/piwik').default.getTracker();
  if (piwik) {
    piwik.trackEvent(
      eventCategories['Logs'],
      eventActions['Exception'],
      isFatal ? eventNames['Fatal Error'] : eventNames['Error'],
      `${namespace}: ${err.name}: ${err.message}`
    );
  }
}

function reportToSentry (namespace, isFatal, err) {
  const sentry = require('common/services/sentry').default;
  if (sentry) {
    anonymizeException(err);
    // trimLongPaths(err);

    console.log('reporting to sentry:', err);
    sentry.captureException(err, {
      level: isFatal ? 'fatal' : 'error',
      extra: {
        trace: new Error().stack
      },
      tags: {
        namespace
      }
    }, function (result) {
      console.log('reported to sentry:', result);
    });
  }
}

export function debugLogger (filename) {
  let logger = null;
  return function () {
    if (!logger) {
      const debug = require('common/modules/debug').default;
      logger = debug(namespaceOfFile(filename));
    }
    const browserLogger = require('common/utils/logger-browser').default;
    logger.log = browserLogger.printDebug;
    logger(util.format(...arguments));
  };
}

export function errorLogger (filename, isFatal) {
  let namespace = null;
  return function (err, skipReporting) {
    if (!namespace) {
      namespace = namespaceOfFile(filename);
    }

    if (!(err instanceof Error)) {
      if (global.options.dev) {
        const fnName = isFatal ? 'logFatal' : 'logError';
        throw new Error('the first parameter to ' + fnName + ' must be an Error');
      } else {
        err = new Error(err);
      }
    }

    const browserLogger = require('common/utils/logger-browser').default;
    browserLogger.printError(namespace, isFatal, err.stack);

    if (!skipReporting) {
      reportToPiwik(namespace, isFatal, err);
      reportToSentry(namespace, isFatal, err);
    }
  };
}
