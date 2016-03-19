import async from 'async';
import path from 'path';
import del from 'del';
import app from 'app';
import fs from 'fs';

const paths = [
  path.join(app.getPath('desktop'), 'WhatsApp for Desktop.lnk'),
  path.join(app.getPath('desktop'), 'WhatsApp.lnk'),
  path.join(app.getPath('desktop'), 'Unofficial WhatsApp for Desktop.lnk'),
  path.join(app.getPath('desktop'), 'Unofficial WhatsApp.lnk'),
  path.join(app.getPath('appData'), '\\Microsoft\\Windows\\Start Menu\\Programs\\WhatsApp for Desktop'),
  path.join(app.getPath('appData'), '\\Microsoft\\Windows\\Start Menu\\Programs\\WhatsApp'),
  path.join(app.getPath('appData'), '\\Microsoft\\Windows\\Start Menu\\Programs\\Unofficial WhatsApp for Desktop'),
  path.join(app.getPath('appData'), '\\Microsoft\\Windows\\Start Menu\\Programs\\Unofficial WhatsApp'),
  'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\WhatsApp for Desktop.lnk',
  'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\WhatsApp.lnk',
  'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Unofficial WhatsApp for Desktop.lnk',
  'C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Unofficial WhatsApp.lnk',
  'C:\\Program Files\\WhatsApp for Desktop',
  'C:\\Program Files\\Unofficial WhatsApp for Desktop',
  'C:\\Program Files (x86)\\WhatsApp for Desktop',
  'C:\\Program Files (x86)\\Unofficial WhatsApp for Desktop'
];

function check(callback) {
  async.series(paths.map(p => function(cb) {
    fs.access(p, fs.R_OK | fs.W_OK, (err) => {
      cb(err ? err : new Error('FOUND'));
    });
  }), function(err) {
    callback(!!(err && err.message === 'FOUND'));
  });
}

function clean(callback) {
  async.parallel(paths.map(p => function(cb) {
    del(p, { force: true })
      .catch(err => {
        logError(err);
        cb();
      })
      .then(paths => {
        log('deleted', paths);
        cb();
      });
  }), callback);
}

export default {
  check,
  clean
};
