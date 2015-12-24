/**
 * Used from the renderer to fire native notifications.
 * Accessing global.application.nativeNotifier directly doens't work.
 */
export default {
  impl: global.application.nativeNotifier.impl,
  fireNotification: ::global.application.nativeNotifier.fireNotification
};
