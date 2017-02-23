let impl = null;

switch (process.type) {
  case 'browser':
    impl = require('debug/node');
    break;

  case 'renderer':
    impl = require('debug/node');
    // Fix for colors and formatting
    const remoteDebug = require('electron').remote.require('debug');
    impl.useColors = function () {
      return remoteDebug.useColors(...arguments);
    };
    break;
}

// Force-enable debug
if (global.options.debug) {
  impl.enable(process.env.DEBUG || global.manifest.name + ':*');
}

export default impl;
