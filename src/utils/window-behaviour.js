var gui = window.require('nw.gui');
var platform = require('./platform');
var settings = require('./settings');

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
          this.saveWindowState(win);
          win.close(true);
        } else {
          win.hide();
        }
      }.bind(this));
    }

    // Open external urls in the browser
    win.on('new-win-policy', function(frame, url, policy) {
      gui.Shell.openExternal(url);
      policy.ignore();
    });
  },

  /**
   * Listen for window state events.
   */
  bindWindowStateEvents: function(win) {
    win.on('maximize', function() {
      win.sizeMode = 'maximized';
    });

    win.on('unmaximize', function() {
      win.sizeMode = 'normal';
    });

    win.on('minimize', function() {
      win.sizeMode = 'minimized';
    });

    win.on('restore', function() {
      win.sizeMode = 'normal';
    });
  },

  /**
   * Bind the events of the node window to the content window.
   */
  bindEvents: function(win, contentWindow) {
    ['focus', 'blur'].forEach(function(name) {
      win.on(name, function() {
        contentWindow.dispatchEvent(new contentWindow.Event(name));
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
  },

  /**
   * Store the window state.
   */
  saveWindowState: function(win) {
    var state = {
      mode: win.sizeMode || 'normal'
    };

    if (state.mode == 'normal') {
      state.x = win.x;
      state.y = win.y;
      state.width = win.width;
      state.height = win.height;
    }

    settings.windowState = state;
  },

  /**
   * Restore the window size and position.
   */
  restoreWindowState: function(win) {
    var state = settings.windowState;

    if (state.mode == 'maximized') {
      win.maximize();
    } else {
      win.resizeTo(state.width, state.height);
      win.moveTo(state.x, state.y);
    }

    win.show();
  }
};
