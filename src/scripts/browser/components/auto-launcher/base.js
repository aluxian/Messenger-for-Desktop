import EventEmitter from 'events';

class BaseAutoLauncher extends EventEmitter {

  enable(hidden = false, callback) {
    callback(new Error('Not implemented'));
  }

  disable(callback) {
    callback(new Error('Not implemented'));
  }

  isEnabled(callback) {
    callback(new Error('Not implemented'));
  }

}

export default BaseAutoLauncher;
