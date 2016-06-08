import platform from 'common/utils/platform';

let impl = null;

if (platform.isLinux) {
  impl = require('browser/components/auto-updater/impl-linux').default;
} else if (platform.isWindows && global.options.portable) {
  impl = require('browser/components/auto-updater/impl-win32-portable').default;
} else {
  impl = require('electron').autoUpdater;
}

export default impl;
