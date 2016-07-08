import promisify from 'promisify-es6';
import Winreg from 'winreg';

import filePaths from 'common/utils/file-paths';
import BaseAutoLauncher from 'browser/components/auto-launcher/base';

const REG_KEY = new Winreg({
  hive: Winreg.HKCU,
  key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
});

const setAsync = promisify(REG_KEY.set, {context: REG_KEY});
const removeAsync = promisify(REG_KEY.remove, {context: REG_KEY});
const keyExistsAsync = promisify(REG_KEY.keyExists, {context: REG_KEY});

class Win32AutoLauncher extends BaseAutoLauncher {

  async enable () {
    const updateExePath = filePaths.getSquirrelUpdateExePath();
    const cmd = [
      '"' + updateExePath + '"',
      '--processStart',
      '"' + global.manifest.productName + '.exe"',
      '--process-start-args',
      '"--os-startup"'
    ].join(' ');

    log('setting registry key for', global.manifest.productName, 'value', cmd);
    await setAsync(global.manifest.productName, Winreg.REG_SZ, cmd);
  }

  async disable () {
    log('removing registry key for', global.manifest.productName);
    try {
      await removeAsync(global.manifest.productName);
    } catch (err) {
      const notFoundMsg = 'The system was unable to find the specified registry key or value.';
      const notFoundErr = err.message && err.message.includes(notFoundMsg);
      const knownError = notFoundErr;
      if (!knownError) {
        throw err;
      }
    }
  }

  async isEnabled () {
    log('querying registry key for', global.manifest.productName);
    const exists = await keyExistsAsync(global.manifest.productName);
    log('registry value for', global.manifest.productName, 'is', exists ? 'enabled' : 'disabled');
    return exists;
  }

}

export default Win32AutoLauncher;
