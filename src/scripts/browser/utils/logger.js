import manifest from '../../../package.json';
import debug from 'debug';
import path from 'path';
import util from 'util';
import app from 'app';
import fs from 'fs';

const fileLogPath = path.join(app.getPath('appData'), 'logs', Date.now() + '.log');
const fileLogStream = fs.createWriteStream(fileLogPath, {flags: 'a'});
const fileLogEnabled = process.env.DEBUG && !process.mas;

if (fileLogEnabled) {
  process.on('exit', (code) => {
    fileLogStream.end('process exited with code ' + code + '\n');
  });
}

export function debugLogger(filename) {
  const name = path.basename(filename, '.js');
  const namespace = manifest.name + ':' + name;
  const logger = debug(namespace);
  logger.log = function() {
    console.error.apply(console, arguments);
    if (fileLogEnabled) {
      fileLogStream.write(util.format.apply(util, arguments) + '\n');
    }
  };
  return logger;
}

export function errorLogger(filename, fatal) {
  const fakePagePath = filename.replace(app.getAppPath(), '');
  return function(...args) {
    args = args.map(a => a instanceof Error ? a.stack : a);
    const argsMessage = util.format.apply(util, args);

    console.error(`[${new Date().toUTCString()}] ${fakePagePath}:`, argsMessage);
    if (fileLogEnabled) {
      fileLogStream.write(argsMessage + '\n');
    }

    const analytics = require('./analytics').default;
    if (analytics) {
      analytics
        .pageview(fakePagePath)
        .exception(argsMessage, fatal)
        .send();
    }
  };
}
