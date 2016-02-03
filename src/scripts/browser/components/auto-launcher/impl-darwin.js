import Plist from 'launchd.plist';
import manifest from '../../../../package.json';

import app from 'app';
import path from 'path';
import fs from 'fs';

import BaseAutoLauncher from './base';

class DarwinAutoLauncher extends BaseAutoLauncher {

  enable(callback) {
    log('writing login plist');
    fs.writeFile(this.getPlistPath(), this.buildPlist(), callback);
  }

  disable(callback) {
    log('removing login plist');
    fs.unlink(this.getPlistPath(), callback);
  }

  isEnabled(callback) {
    log('checking login plist access');
    fs.access(this.getPlistPath(), fs.R_OK | fs.W_OK, (err) => {
      if (err) {
        log('login plist access error', err);
        callback(null, false);
      } else {
        callback(null, true);
      }
    });
  }

  getPlistPath() {
    const plistName = manifest.darwin.bundleId + '.plist';
    return path.join(app.getPath('home'), 'Library', 'LaunchAgents', plistName);
  }

  buildPlist() {
    const plist = new Plist();
    plist.setLabel(manifest.darwin.bundleId);
    plist.setProgram(app.getPath('exe'));
    plist.setProgramArgs(['--os-startup', '--', '--os-startup']);
    plist.setRunAtLoad(true);
    return plist.build();
  }

}

export default DarwinAutoLauncher;
