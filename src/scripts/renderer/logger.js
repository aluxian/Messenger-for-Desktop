import manifest from '../../package.json';
import debug from 'debug/browser';
import path from 'path';
import {app} from 'remote';

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
      // TODO: send exception to errbit
    }
  };
}
