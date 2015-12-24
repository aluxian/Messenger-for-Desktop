import manifest from '../../../../package.json';
import async from 'async';
import path from 'path';
import app from 'app';
import fs from 'fs';

import BaseAutoLauncher from './base';

const autoStartKey = 'X-GNOME-Autostart-enabled';
const autoStartDir = path.join(app.getPath('home'), '.config', 'autostart');
const desktopPath = path.join(autoStartDir, manifest.name + '.desktop');

class LinuxAutoLauncher extends BaseAutoLauncher {

  setKey(value, callback) {
    log('setting', autoStartKey, value);
    async.waterfall([
      async.apply(fs.readFile, desktopPath, 'utf-8'),
      (file, callback) => {
        const pattern = new RegExp(autoStartKey + '=.*');
        const replaceWith = autoStartKey + '=' + value;
        const newFile = file.replace(pattern, replaceWith);
        fs.writeFile(desktopPath, newFile, 'utf-8', callback);
      }
    ], callback);
  }

  enable(hidden = false, callback) {
    this.setKey('true', callback);
  }

  disable(callback) {
    this.setKey('false', callback);
  }

  isEnabled(callback) {
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
  }

}

export default LinuxAutoLauncher;
