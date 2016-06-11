let impl = null;

switch (process.type) {
  case 'browser':
    impl = require('browser/bridges/native-notifier').default;
    break;

  case 'renderer':
    impl = require('electron').remote.require('../browser/bridges/native-notifier').default;
    break;
}

export default impl;
