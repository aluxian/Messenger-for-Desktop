import manifest from '../../package.json';
import debug from 'debug/browser';
import {app} from 'remote';
import path from 'path';

function anonymizeException(ex) {
  // Replace username in C:\Users\<username>\AppData\
  const exMsgBits = ex.message.split('\\');
  const c1 = exMsgBits[0] === 'C:';
  const c2 = exMsgBits[1] === 'Users';
  const c3 = exMsgBits[3] === 'AppData';
  if (c1 && c2 && c3) {
    exMsgBits[2] = '<username>';
    ex.message = exMsgBits.join('\\');
  }
}

function trimLongPaths(ex) {
  ex.stack = ex.stack
    .split('\n')
    .map(line => line.replace(/\/.+atom\.asar/, 'atom.asar'))
    .map(line => line.replace(app.getAppPath(), 'app'))
    .join('\n');
}

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

        anonymizeException(ex);
        trimLongPaths(ex);

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
