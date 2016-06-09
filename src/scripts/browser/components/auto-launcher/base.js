import EventEmitter from 'events';

class BaseAutoLauncher extends EventEmitter {

  async enable () {
    throw new Error('Not implemented');
  }

  async disable () {
    throw new Error('Not implemented');
  }

  async isEnabled () {
    throw new Error('Not implemented');
  }

}

export default BaseAutoLauncher;
