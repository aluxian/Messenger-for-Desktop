import manifest from '../../package.json';
import debug from 'debug/browser';
import {app} from 'remote';
import path from 'path';

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
    console.error(`[${fakePagePath}]`, ex, ...args);
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
        // Wrap the error for more stack trace data
        const err = new Error(ex);
        err.fakePagePath = resolveUrl(fakePagePath);
        airbrake.notify({ error: err });
      }
    }
  };
}
