let impl = null;

switch (process.type) {
  case 'browser':
    impl = require('browser/utils/logger');
    break;

  case 'renderer':
    impl = require('electron').remote.require('../browser/utils/logger');
    break;
}

export default impl;
