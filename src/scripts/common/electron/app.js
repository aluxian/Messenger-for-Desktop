let impl = null;

switch (process.type) {
  case 'browser':
    impl = require('app');
    break;

  case 'renderer':
    impl = require('remote').app;
    break;
}

export default impl;
