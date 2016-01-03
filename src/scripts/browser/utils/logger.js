import manifest from '../../../package.json';
import debug from 'debug';
import path from 'path';
import app from 'app';

export function debugLogger(filename) {
  const name = path.basename(filename, '.js');
  const namespace = manifest.name + ':' + name;
  return debug(namespace);
}

export function errorLogger(filename, fatal) {
  const fakePagePath = filename.replace(app.getAppPath(), '');
  return function(...args) {
    console.error(`[${fakePagePath}]`, ...args);
    const analytics = require('./analytics');
    if (analytics) {
      analytics
        .pageview(fakePagePath)
        .exception(args.join(' '), fatal)
        .send();
    }
  };
}
