function createAppliedHandler (name) {
  return function () {
    const nativeNotifier = global.application.nativeNotifier;
    const func = nativeNotifier[name];
    if (func) {
      func.apply(nativeNotifier, arguments);
    }
  };
}

/**
 * Used from the renderer to fire native notifications.
 * Accessing global.application.nativeNotifier directly doesn't work.
 */
export default {
  isImplemented: !!global.application.nativeNotifier.isImplemented,
  fireNotification: createAppliedHandler('fireNotification'),
  removeNotification: createAppliedHandler('removeNotification'),
  onClick: createAppliedHandler('onClick')
};
