let impl = null;

switch (process.type) {
  case 'browser':
    impl = require('debug');
    break;

  case 'renderer':
    impl = require('debug');
    // Fix for colors and formatting
    const remoteDebug = require('electron').remote.require('debug');
    impl.useColors = function () {
      return remoteDebug.useColors(...arguments);
    };
    break;
}

// Force-enable debug
if (global.options.debug && !process.env.DEBUG) {
  process.env.DEBUG = global.manifest.name + ':*';
  impl.enable(process.env.DEBUG);
}

export default impl;
