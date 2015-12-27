import platform from '../../utils/platform';

let impl = null;

if (platform.isLinux) {
  impl = require('./impl-linux').default;
} else {
  impl = require('auto-updater');
}

export default impl;
