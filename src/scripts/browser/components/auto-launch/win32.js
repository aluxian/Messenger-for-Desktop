import manifest from '../../../../package.json';
import Winreg from 'winreg';
import app from 'app';

const regKey = new Winreg({
  hive: Winreg.HKCU,
  key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
});

export function enable(hidden = false, callback) {
  const cmd = '"' + app.getPath('exe') + '" --os-startup';
  log('setting registry key for', manifest.productName, 'value', cmd);
  regKey.set(manifest.productName, Winreg.REG_SZ, cmd, callback);
}

export function disable(callback) {
  log('removing registry key for', manifest.productName);
  regKey.remove(manifest.productName, callback);
}

export function isEnabled(callback) {
  log('querying registry key for', manifest.productName);
  regKey.get(manifest.productName, function(err, item) {
    const enabled = !!item;
    log('registry value for', manifest.productName, 'is', enabled);
    callback(err, enabled);
  });
}
