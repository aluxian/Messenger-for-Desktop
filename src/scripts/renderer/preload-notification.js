import EventEmitter from 'events';
import remote from 'remote';

const nativeNotifier = remote.require('../browser/bridges/native-notifier').default;

// Extend the default notification API
window.Notification = (function(Html5Notification) {
  log('extending HTML5 Notification');

  const Notification = function(title, options) {
    if (!nativeNotifier.impl) {
      log('showing html5 notification');
      return new Html5Notification(title, options);
    }

    log('showing native notification');
    const nativeOptions = Object.assign({}, options, {
      canReply: true,
      title: title
    });

    // HTML5-like event emitter to be returned
    const result = Object.assign(new EventEmitter(), nativeOptions);

    // Set the click handler
    nativeOptions.onClick = function(payload) {
      log('notification clicked', payload);
      result.emit('click');

      // Call additional handlers
      if (result.onclick) {
        result.onclick();
      }

      // Send the reply
      if (payload.response) {
        log('REPLY:', payload.response); // TODO
      }
    };

    // Fire the notification
    nativeNotifier.fireNotification(nativeOptions);
    return result;
  };

  return Object.assign(Notification, Html5Notification);
})(window.Notification);
