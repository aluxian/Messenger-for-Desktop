import manifest from '../../../../package.json';
import Winreg from 'winreg';
import app from 'app';

import BaseAutoLauncher from './base';

class Win32AutoLauncher extends BaseAutoLauncher {

  static REG_KEY = new Winreg({
    hive: Winreg.HKCU,
    key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
  });

  enable(hidden = false, callback) {
    const cmd = '"' + app.getPath('exe') + '" --os-startup';
    log('setting registry key for', manifest.productName, 'value', cmd);
    Win32AutoLauncher.REG_KEY.set(manifest.productName, Winreg.REG_SZ, cmd, callback);
  }

  disable(callback) {
    log('removing registry key for', manifest.productName);
    Win32AutoLauncher.REG_KEY.remove(manifest.productName, callback);
  }

  isEnabled(callback) {
    log('querying registry key for', manifest.productName);
    Win32AutoLauncher.REG_KEY.get(manifest.productName, function(err, item) {
      const enabled = !!item;
      log('registry value for', manifest.productName, 'is', enabled);
      callback(err, enabled);
    });
  }

}

export default Win32AutoLauncher;
