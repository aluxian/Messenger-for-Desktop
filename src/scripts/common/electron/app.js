let impl = null;

switch (process.type) {
  case 'browser':
    impl = require('electron').app;
    break;

  case 'renderer':
    impl = require('electron').remote.app;
    break;
}

export default impl;
