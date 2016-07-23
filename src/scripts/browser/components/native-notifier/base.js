import EventEmitter from 'events';

class BaseNativeNotifier extends EventEmitter {

  static ACTIVATION_TYPES = [
    'none',
    'contents-clicked',
    'action-clicked',
    'replied',
    'additional-action-clicked'
  ];

  constructor () {
    super();

    // Flag that this notifier has not been implemented
    this.isImplemented = false;
  }

}

export default BaseNativeNotifier;
