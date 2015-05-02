module.exports = {
  /**
   * Inject a callback in the onclick event.
   */
  inject: function(contentWindow, win) {
    var NativeNotification = contentWindow.Notification;

    contentWindow.Notification = function(title, options) {
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

    contentWindow.Notification.prototype = NativeNotification.prototype;
    contentWindow.Notification.permission = NativeNotification.permission;
    contentWindow.Notification.requestPermission = NativeNotification.requestPermission.bind(contentWindow.Notification);
  }
};
