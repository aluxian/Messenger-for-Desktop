module.exports = {
  /**
   * Inject a callback in the onclick event.
   */
  injectClickCallback: function(window, win) {
    var NativeNotification = window.Notification;

    window.Notification = function(title, options) {
      options.onclick = (function(defaultOnClick) {
        return function() {
          win.show();
          win.focus();

          if (defaultOnClick) {
            defaultOnClick();
          }
        };
      })(options.onclick);
      return new NativeNotification(title, options);
    };

    window.Notification.prototype = NativeNotification.prototype;
    window.Notification.permission = NativeNotification.permission;
    window.Notification.requestPermission = NativeNotification.requestPermission.bind(window.Notification);
  }
};
