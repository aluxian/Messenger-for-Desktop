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
  return function(...args) {
    console.error(`[${fakePagePath}]`, ...args);
    const ga = require('./analytics').default;
    if (ga) {
      ga('set', {
        page: fakePagePath,
        title: namespace
      });
      ga('send', 'exception', {
        exDescription: args.join(' '),
        exFatal: fatal
      });
    }
  };
}
