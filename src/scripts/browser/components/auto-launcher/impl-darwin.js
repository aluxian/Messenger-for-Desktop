import Plist from 'launchd.plist';
import fs from 'fs-extra-promise';
import {app} from 'electron';
import path from 'path';

import BaseAutoLauncher from 'browser/components/auto-launcher/base';
import files from 'common/utils/files';

const plistName = global.manifest.darwin.bundleId + '.plist';
const plistPath = path.join(app.getPath('home'), 'Library', 'LaunchAgents', plistName);

class DarwinAutoLauncher extends BaseAutoLauncher {

  async enable () {
    log('enabling darwin auto-launch');
    log('creating login plist');
    await files.replaceFile(plistPath, () => fs.writeFileAsync(plistPath, this.buildPlist(), 'utf8'));
  }

  async disable () {
    log('disabling linux auto-launch');
    log('removing login plist');
    await fs.removeAsync(plistPath);
  }

  async isEnabled () {
    log('checking darwin auto-launch');
    await files.isFileExists(plistPath);
  }

  buildPlist () {
    const plist = new Plist();
    plist.setLabel(global.manifest.darwin.bundleId);
    plist.setProgram(app.getPath('exe'));
    plist.setProgramArgs(['--os-startup']);
    plist.setRunAtLoad(true);
    return plist.build();
  }

}

export default DarwinAutoLauncher;
