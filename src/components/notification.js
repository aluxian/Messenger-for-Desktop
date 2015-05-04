module.exports = {
  /**
   * Inject a callback in the onclick event.
   */
  inject: function(contentWindow, win) {
    var NativeNotification = contentWindow.Notification;

    contentWindow.Notification = function(title, options) {
      var defaultOnClick = options.onclick;
      delete options.onclick;

      var notif = new NativeNotification(title, options);
      notif.onclick = function() {
        win.show();
        win.focus();

        if (defaultOnClick) {
          defaultOnClick();
        }
      };

      return notif;
    };

    contentWindow.Notification.prototype = NativeNotification.prototype;
    contentWindow.Notification.permission = NativeNotification.permission;
    contentWindow.Notification.requestPermission = NativeNotification.requestPermission.bind(contentWindow.Notification);
  }
};
