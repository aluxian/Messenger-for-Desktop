import stripAnsi from 'strip-ansi';
import fs from 'fs-extra-promise';
import {app} from 'electron';
import util from 'util';
import path from 'path';
import os from 'os';

let fileLogStream = null;
let fileLogIsGettingReady = false;
let fileLogIsReady = false;

function isFileLogEnabled() {
  return global.options.debug && !global.options.mas;
}

function initFileLogging() {
  if (fileLogIsGettingReady) {
    return;
  }
  fileLogIsGettingReady = true;

  try {
    const fileLogsDir = path.join(app.getPath('userData'), 'logs');
    fs.mkdirsSync(fileLogsDir);

    const fileLogPath = path.join(fileLogsDir, Date.now() + '.log');
    fileLogStream = fs.createWriteStream(null, {
      fd: fs.openSync(fileLogPath, 'a')
    });

    process.on('exit', (code) => {
      fileLogStream.end('process exited with code ' + code + os.EOL);
      fileLogStream = null;
    });

    log(`saving logs to "${fileLogPath}"`);
    fileLogIsReady = true;
    fileLogIsGettingReady = false;
  } catch (err) {
    fileLogIsGettingReady = false;
    console.error('logger error:', err);
  }
}

export function writeLog() {
  if (isFileLogEnabled() && !fileLogIsReady) {
    initFileLogging();
  }
  if (fileLogStream) {
    fileLogStream.write(stripAnsi(util.format(...arguments)) + os.EOL);
  }
}
