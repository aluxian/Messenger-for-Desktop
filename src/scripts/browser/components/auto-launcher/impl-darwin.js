import Plist from 'launchd.plist';
import fs from 'fs-extra-promise';
import path from 'path';
import app from 'app';

import BaseAutoLauncher from 'browser/components/auto-launcher/base';

class DarwinAutoLauncher extends BaseAutoLauncher {

  async enable() {
    log('writing login plist');
    await fs.writeFileAsync(this.getPlistPath(), this.buildPlist(), 'utf8');
  }

  async disable() {
    log('removing login plist');
    await fs.removeAsync(this.getPlistPath());
  }

  async isEnabled() {
    log('checking login plist access');
    try {
      const plistPath = this.getPlistPath();
      await fs.accessAsync(plistPath, fs.R_OK | fs.W_OK);
      const stats = await fs.lstatAsync(plistPath);
      if (!stats.isFile()) {
        throw new Error('not a file');
      }
    } catch (err) {
      log('login plist access error', err);
      return false;
    }
    return true;
  }

  getPlistPath() {
    const plistName = global.manifest.darwin.bundleId + '.plist';
    return path.join(app.getPath('home'), 'Library', 'LaunchAgents', plistName);
  }

  buildPlist() {
    const plist = new Plist();
    plist.setLabel(global.manifest.darwin.bundleId);
    plist.setProgram(app.getPath('exe'));
    plist.setProgramArgs(['--os-startup']);
    plist.setRunAtLoad(true);
    return plist.build();
  }

}

export default DarwinAutoLauncher;
