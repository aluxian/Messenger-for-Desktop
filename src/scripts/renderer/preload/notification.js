import EventEmitter from 'events';
import {remote} from 'electron';

import platform from 'common/utils/platform';

const nativeNotifier = remote.require('common/bridges/native-notifier').default;
const mainWindowManager = remote.getGlobal('application').mainWindowManager;

// Extend the default notification API
window.Notification = (function (Html5Notification) {
  log('extending HTML5 Notification');

  const Notification = function (title, options) {
    if (!nativeNotifier.isImplemented || (!platform.isDarwin && !platform.isWindows7)) {
      log('showing html5 notification', title, options);
      const notification = new Html5Notification(title, options);

      // Add click listener to focus the app
      notification.addEventListener('click', function () {
        mainWindowManager.showOrCreate();
      });

      return notification;
    }

    log('showing native notification');
    const nativeOptions = Object.assign({}, options, {
      canReply: options.canReply !== false,
      title
    });

    // HTML5-like event emitter to be returned
    const result = Object.assign(new EventEmitter(), nativeOptions);

    // Add a close handler
    result.close = function () {
      if (result.__data) {
        nativeNotifier.removeNotification(result.__data.identifier);
      } else {
        logFatal(new Error('tried to close notification with falsy __data'));
      }
    };

    // Set the click handler
    nativeOptions.onClick = function (payload) {
      log('notification clicked', JSON.stringify(payload));
      result.emit('click');

      // Call additional handlers
      if (result.onclick) {
        result.onclick();
      }

      // Send the reply
      if (payload && payload.response) {
        log('sending reply', payload.response);
        setTimeout(function () {
          if (typeReply(payload.response)) {
            sendReply();
          }
        }, 50);
      } else {
        mainWindowManager.showOrCreate();
      }
    };

    // Set the creation callback
    nativeOptions.onCreate = function (data) {
      result.__data = data;
    };

    // Fire the notification
    nativeNotifier.fireNotification(nativeOptions);
    return result;
  };

  return Object.assign(Notification, Html5Notification);
})(window.Notification);

function typeReply (replyText, elem) {
  const event = document.createEvent('TextEvent');
  event.initTextEvent('textInput', true, true, window, replyText, 0, 'en-US');
  const inputField = document.querySelector('[contenteditable="true"]');
  if (inputField) {
    inputField.focus();
    return inputField.dispatchEvent(event);
  }
  return false;
}

function sendReply () {
  const event = new window.MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  const sendButton = document.querySelector('[role="region"] a[aria-label][href="#"]');
  if (sendButton) {
    sendButton.dispatchEvent(event);
  }
}
