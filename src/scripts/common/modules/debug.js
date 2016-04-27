let impl = null;

switch (process.type) {
  case 'browser':
    impl = require('debug');
    break;

  case 'renderer':
    impl = require('debug');
    // Fix for colors and formatting
    const remoteDebug = require('remote').require('debug');
    impl.useColors = function() {
      return remoteDebug.useColors(...arguments);
    };
    break;
}

export default impl;
