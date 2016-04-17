import manifest from '../../../../package.json';
import async from 'async';
import path from 'path';
import app from 'app';
import fs from 'fs-extra';

import BaseAutoLauncher from './base';

const autoStartKey = 'X-GNOME-Autostart-enabled';
const autoStartDir = path.join(app.getPath('home'), '.config', 'autostart');
const desktopPath = path.join(autoStartDir, manifest.name + '.desktop');
const systemDesktopPath = path.join('/etc/xdg/autostart/', manifest.name + '.desktop');

class LinuxAutoLauncher extends BaseAutoLauncher {

  ensureFileExists(callback) {
    fs.access(desktopPath, fs.R_OK | fs.W_OK, (err) => {
      if (err) { // no access / does not exist
        fs.unlink(desktopPath, () => { // err ignored
          fs.copy(systemDesktopPath, desktopPath, callback);
        });
      } else { // ok
        callback(null);
      }
    });
  }

  setKey(value, callback) {
    this.ensureFileExists((ensureErr) => {
      if (ensureErr) {
        logError(ensureErr);
      }

      log('setting', autoStartKey, value);
      async.waterfall([
        async.apply(fs.readFile, desktopPath, 'utf-8'),
        (fileContent, callback) => {
          const pattern = new RegExp(autoStartKey + '=.*');
          const replaceWith = autoStartKey + '=' + value;
          const newFileContent = fileContent.replace(pattern, replaceWith);
          fs.writeFile(desktopPath, newFileContent, 'utf-8', callback);
        }
      ], callback);
    });
  }

  enable(callback) {
    this.setKey('true', callback);
  }

  disable(callback) {
    this.setKey('false', callback);
  }

  isEnabled(callback) {
    this.ensureFileExists((ensureErr) => {
      if (ensureErr) {
        logError(ensureErr);
      }

      log('checking key', autoStartKey);
      fs.readFile(desktopPath, 'utf-8', function(err, file) {
        if (err) {
          return callback(err);
        }

        const pattern = new RegExp(autoStartKey + '=(.*)');
        const matches = pattern.exec(file);
        const enabled = matches && matches[1] == 'true';

        log(autoStartKey, 'is', enabled);
        callback(null, enabled);
      });
    });
  }

}

export default LinuxAutoLauncher;
