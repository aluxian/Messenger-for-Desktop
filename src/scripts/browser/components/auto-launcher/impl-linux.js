import fs from 'fs-extra-promise';
import {app} from 'electron';
import path from 'path';

import BaseAutoLauncher from 'browser/components/auto-launcher/base';
import files from 'common/utils/files';

const autoStartDir = path.join(app.getPath('home'), '.config', 'autostart');
const desktopFilePath = path.join(autoStartDir, global.manifest.name + '.desktop');
const initialDesktopPath = path.join(app.getAppPath(), 'startup.desktop');

class LinuxAutoLauncher extends BaseAutoLauncher {

  async enable () {
    log('enabling linux auto-launch');
    log('creating autolaunch .desktop');
    await files.replaceFile(desktopFilePath, () => fs.copyAsync(initialDesktopPath, desktopFilePath));
  }

  async disable () {
    log('disabling linux auto-launch');
    log('removing autolaunch .desktop');
    await fs.removeAsync(desktopFilePath);
  }

  async isEnabled () {
    log('checking linux auto-launch');
    await files.isFileExists(desktopFilePath);
  }

}

export default LinuxAutoLauncher;
