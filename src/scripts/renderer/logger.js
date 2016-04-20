import manifest from '../../package.json';
import debug from 'debug/browser';
import remote, {app} from 'remote';
import path from 'path';

const browserLogger = remote.require('../browser/utils/logger').default;

function namespaceOf(filename) {
  const name = path.basename(filename, '.js');
  return manifest.name + ':' + name;
}

export function debugLogger(filename) {
  return debug(namespaceOf(filename));
}

export function errorLogger(filename, fatal) {
  const fakePagePath = filename.replace(app.getAppPath(), '');
  const namespace = namespaceOf(filename);
  return function(ex, ...args) {
    if (ex.__skip_log) {
      delete ex.__skip_log;
    } else {
      console.error(`[${fakePagePath}]`, ex, ...args);
    }

    if (ex instanceof Error) {
      const analytics = require('./analytics').getTracker();
      if (analytics) {
        analytics.trackEvent(
          'Exceptions',
          fatal ? 'FatalError' : 'Error',
          ex.name,
          `[${namespace}]: ${ex.message}`
        );
      }

      const airbrake = require('./airbrake').default;
      const resolveUrl = require('./airbrake').resolveUrl;

      if (airbrake) {
        ex.stack = [
          ex.stack,
          '    at ()',
          (new Error()).stack.substr(6)
        ].join('\n');

        browserLogger.anonymizeException(ex);
        browserLogger.trimLongPaths(ex);

        airbrake.notify({
          error: ex,
          context: {
            url: resolveUrl(fakePagePath)
          },
          session: {
            raw_stack: ex.stack.split('\n')
          }
        });
      }
    }
  };
}
