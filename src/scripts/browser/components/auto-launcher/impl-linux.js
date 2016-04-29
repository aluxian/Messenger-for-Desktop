import fs from 'fs-extra';
import path from 'path';
import app from 'app';

import BaseAutoLauncher from 'browser/components/auto-launcher/base';

const autoStartDir = path.join(app.getPath('home'), '.config', 'autostart');
const desktopFilePath = path.join(autoStartDir, global.manifest.name + '.desktop');
const initialDesktopPath = path.join(app.getAppPath(), 'startup.desktop');

class LinuxAutoLauncher extends BaseAutoLauncher {

  async enable() {
    log('enabling linux auto-launch');
    try {
      await fs.accessAsync(desktopFilePath, fs.R_OK | fs.W_OK);
      const stats = await fs.lstatAsync(desktopFilePath);
      if (!stats.isFile()) {
        throw new Error();
      }
    } catch (err) {
      // err ignored
      // no access / does not exist
      try {
        await fs.removeAsync(desktopFilePath);
      } catch (err2) {
        // err2 ignored
      }
      await fs.copyAsync(initialDesktopPath, desktopFilePath);
    }
  }

  async disable() {
    log('disabling linux auto-launch');
    await fs.removeAsync(desktopFilePath);
  }

  async isEnabled() {
    log('checking linux auto-launch');
    try {
      await fs.accessAsync(desktopFilePath, fs.R_OK | fs.W_OK);
      const stats = await fs.lstatAsync(desktopFilePath);
      return stats.isFile();
    } catch (err) {
      return false;
    }
  }

}

export default LinuxAutoLauncher;
