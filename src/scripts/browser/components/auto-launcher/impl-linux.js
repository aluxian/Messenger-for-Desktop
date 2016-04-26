import fs from 'fs-extra';
import path from 'path';
import app from 'app';

import BaseAutoLauncher from './base';

const autoStartKey = 'X-GNOME-Autostart-enabled';
const autoStartDir = path.join(app.getPath('home'), '.config', 'autostart');
const desktopFileName = global.manifest.name + '.desktop';
const desktopFilePath = path.join(autoStartDir, desktopFileName);
const systemDesktopPath = path.join('/etc/xdg/autostart/', desktopFileName);

class LinuxAutoLauncher extends BaseAutoLauncher {

  async ensureFileExists() {
    try {
      await fs.accessAsync(desktopFilePath, fs.R_OK | fs.W_OK);
    } catch (err) {
      // err ignored
      // no access / does not exist
      try {
        await fs.unlinkAsync(desktopFilePath);
      } catch (err2) {
        // err2 ignored
      }
      await fs.copyAsync(systemDesktopPath, desktopFilePath);
    }
    // ok
  }

  async setKey(value) {
    await this.ensureFileExists();
    log('setting', autoStartKey, value);

    const pattern = new RegExp(autoStartKey + '=.*');
    const replaceWith = autoStartKey + '=' + value;

    const fileContent = await fs.readFileAsync(desktopFilePath, 'utf-8');
    const newFileContent = fileContent.replace(pattern, replaceWith);

    await fs.writeFileAsync(desktopFilePath, newFileContent, 'utf-8');
  }

  async enable() {
    await this.setKey('true');
  }

  async disable() {
    await this.setKey('false');
  }

  async isEnabled() {
    try {
      await this.ensureFileExists();
    } catch (err) {
      return false;
    }

    log('checking key', autoStartKey);
    const file = await fs.readFileAsync(desktopFilePath, 'utf-8');

    const pattern = new RegExp(autoStartKey + '=(.*)');
    const matches = pattern.exec(file) || [];
    const enabled = matches[1] == 'true';

    log(autoStartKey, 'is', enabled);
    return enabled;
  }

}

export default LinuxAutoLauncher;
