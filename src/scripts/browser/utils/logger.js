import manifest from '../../../package.json';
import stripAnsi from 'strip-ansi';
import mkdirp from 'mkdirp';
import debug from 'debug';
import path from 'path';
import util from 'util';
import app from 'app';
import fs from 'fs';

let fileLogStream = null;
let fileLogInit = false;
let duringInit = false;

function isFileLogEnabled() {
  return global.options.debug && !process.mas;
}

function initFileLogging() {
  if (duringInit) {
    return;
  }
  duringInit = true;

  try {
    const fileLogsDir = path.join(app.getPath('userData'), 'logs');
    mkdirp.sync(fileLogsDir);

    const fileLogPath = path.join(fileLogsDir, Date.now() + '.log');
    fileLogStream = fs.createWriteStream(null, {fd: fs.openSync(fileLogPath, 'a')});

    process.on('exit', (code) => {
      fileLogStream.end('process exited with code ' + code + '\n');
      fileLogStream = null;
    });

    console.log(`saving logs to "${fileLogPath}"`);
    fileLogInit = true;
    duringInit = false;
  } catch(ex) {
    duringInit = false;
    throw ex;
  }
}

export function debugLogger(filename) {
  const name = path.basename(filename, '.js');
  const namespace = manifest.name + ':' + name;
  const logger = debug(namespace);
  logger.log = function() {
    console.error.apply(console, arguments);

    if (isFileLogEnabled() && !fileLogInit) {
      initFileLogging();
    }
    if (fileLogStream) {
      fileLogStream.write(stripAnsi(util.format.apply(util, arguments)) + '\n');
    }
  };
  return logger;
}

export function errorLogger(filename, fatal) {
  const fakePagePath = filename.replace(app.getAppPath(), '');
  return function(...args) {
    args = args.map(a => a instanceof Error ? a.stack : a);
    const argsMessage = stripAnsi(util.format.apply(util, args));

    const errorPrefix = `[${new Date().toUTCString()}] ${fakePagePath}:`;
    console.error(errorPrefix, argsMessage);

    if (isFileLogEnabled() && !fileLogInit) {
      initFileLogging();
    }
    if (fileLogStream) {
      fileLogStream.write(errorPrefix + ' ' + argsMessage + '\n');
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
