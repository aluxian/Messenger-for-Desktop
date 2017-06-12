let impl = null;

if (process.platform === 'linux') {
  impl = require('browser/components/auto-updater/impl-linux').default;
} else if (process.platform === 'win32' && global.options.portable) {
  impl = require('browser/components/auto-updater/impl-win32-portable').default;
} else {
  impl = require('electron').autoUpdater;
}

export default impl;
