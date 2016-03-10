/**
 * Used from the renderer to fire native notifications.
 * Accessing global.application.nativeNotifier directly doens't work.
 */
export default {
  isImplemented: !!global.application.nativeNotifier.isImplemented,
  fireNotification: function() {
    const fireNotification = global.application.nativeNotifier.fireNotification;
    if (fireNotification) {
      fireNotification.apply(this, arguments);
    }
  }
};
