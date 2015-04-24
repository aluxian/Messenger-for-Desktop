var gui = window.require('nw.gui');
var platform = require('./platform');

module.exports = {
  /**
   * Update the behaviour of the given window object.
   */
  set: function(win) {
    // Show the window when the dock icon is pressed
    gui.App.on('reopen', function() {
      win.show();
    });

    // Don't quit the app when the window is closed
    if (!platform.isLinux) {
      win.on('close', function(quit) {
        if (quit) {
          win.close(true);
        } else {
          win.hide();
        }
      });
    }

    // Open external urls in the browser
    win.on('new-win-policy', function(frame, url, policy) {
      gui.Shell.openExternal(url);
      policy.ignore();
    });
  },

  /**
   * Bind the events of the node window to the content window.
   */
  bindEvents: function(win, window) {
    ['focus', 'blur'].forEach(function(name) {
      win.on(name, function() {
        window.dispatchEvent(new window.Event(name));
      });
    });
  },

  /**
   * Sen an interval to sync the title.
   */
  syncTitle: function(parentDoc, childDoc) {
    setInterval(function() {
      parentDoc.title = childDoc.title;
    }, 50);
  },

  /**
   * Sen an interval to sync the badge.
   */
  syncBadge: function(win, doc) {
    var notifCountRegex = /\((\d)\)/;
    var keepStateRegex = /.*messaged you.*/;

    setInterval(function() {
      if (keepStateRegex.test(doc.title)) {
        // This prevents the badge from blinking at the same time with the title
        return;
      }

      var countMatch = notifCountRegex.exec(doc.title);
      var label = countMatch && countMatch[1] || '';
      win.setBadgeLabel(label);
    }, 50);
  }
};
