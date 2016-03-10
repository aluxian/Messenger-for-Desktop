import EventEmitter from 'events';

class BaseNativeNotifier extends EventEmitter {

  static ACTIVATION_TYPES = [
    'none',
    'contents-clicked',
    'action-clicked',
    'replied',
    'additional-action-clicked'
  ];

}

export default BaseNativeNotifier;
