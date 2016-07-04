var gui = window.require('nw.gui');
var platform = require('./platform');
var settings = require('./settings');
var utils = require('./utils');
var dispatcher = require('./dispatcher')

var lastLabel = '';

module.exports = {
  /**
   * Update the behaviour of the given window object.
   */
  set: function(win) {
    // Show the window when the dock icon is pressed
    gui.App.removeAllListeners('reopen');
    gui.App.on('reopen', function() {
      win.show();
    });

    gui.App.on('open', function() {
      win.show();
    });

    // Don't quit the app when the window is closed
    win.removeAllListeners('close');
	// Forward the close event to the dispatcher
	win.on('close', function(quit) {
		dispatcher.trigger('close', quit)
	});
	// Listen to the dispatcher for the close event.
	// Allows menu item to dispatch a close event.
	dispatcher.addEventListener('close', function(quit) {
	  // Always save and hide
	  this.saveWindowState(win);		
	  win.hide();
	  // If we are quitting, close.
	  if (quit) {
	    setTimeout(function() {
	  	  win.close(true);
	    }, 1); // On next tick.
	  }
	}.bind(this));
  },

  /**
   * Close the window using the ESC key.
   */
  closeWithEscKey: function(win, doc) {
    doc.onkeydown = function(e) {
      if (e.keyCode == 27 && settings.closeWithEscKey) {
        e.preventDefault();

        var imagePopUp = doc.querySelectorAll('._n8._3qx._1j1h.uiLayer._3qw');

        if(imagePopUp.length > 0)
          return false;
        else
          win.close();
        return false;
      }
    }
  },

  /**
   * Change the new window policy to open links in the browser or another window.
   */
  setNewWinPolicy: function(win) {
    win.removeAllListeners('new-win-policy');
    win.on('new-win-policy', function(frame, url, policy) {
      if (url == 'about:blank') {
        return policy.ignore(); // Ignore about:blank URLs
      }

      if (settings.openLinksInBrowser && !utils.isVideoCall(url)) {
        url = utils.skipFacebookRedirect(url);
        gui.Shell.openExternal(url);
        policy.ignore();
      } else {
        policy.forceNewWindow();
      }
    });
  },

  /**
   * Listen for window state events.
   */
  bindWindowStateEvents: function(win) {
    win.removeAllListeners('maximize');
    win.on('maximize', function() {
      win.sizeMode = 'maximized';
    });

    win.removeAllListeners('unmaximize');
    win.on('unmaximize', function() {
      win.sizeMode = 'normal';
    });

    win.removeAllListeners('minimize');
    win.on('minimize', function() {
      win.sizeMode = 'minimized';
    });

    win.removeAllListeners('restore');
    win.on('restore', function() {
      win.sizeMode = 'normal';
    });
  },

  /**
   * Bind the events of the node window to the content window.
   */
  bindEvents: function(win, contentWindow) {
    ['focus', 'blur'].forEach(function(name) {
      win.removeAllListeners(name);
      win.on(name, function() {
        if (contentWindow.dispatchEvent && contentWindow.Event) {
          contentWindow.dispatchEvent(new contentWindow.Event(name));
        }
      });
    });
  },

  /**
   * Set an interval to sync the badge and the title.
   */
  syncBadgeAndTitle: function(win, parentDoc, childDoc) {
    if(this.syncBadgeInterval) {
      clearInterval(this.syncBadgeInterval);
      delete this.syncBadgeInterval;
    }

    var notifCountRegex = /\((\d)\)/;
    var defaultTitle = childDoc.title;

    this.syncBadgeInterval = setInterval(function() {
      var label = '';
	  if(!win.window.navigator.onLine) {
		parentDoc.title = 'Messenger - Offline';
		return;
	  } else {
        parentDoc.title = childDoc.title;

        if (childDoc.title != defaultTitle) {
          var countMatch = notifCountRegex.exec(childDoc.title);
          label = countMatch && countMatch[1] || '';

          if (!label) {
            // Probably it says that someone messaged the user
            // This prevents the badge from blinking at the same time with the title
            return;
          }
        }
	  }
	  
	  if(label == lastLabel) {
		  // The label is no different to the last time it was set 
		  // So don't bother invoking the win.set method.
		  return;
	  }
	
	  // Track the label for debouncing. 
	  lastLabel = label;
      win.setBadgeLabel(label);

      // Update the tray icon too
      if (win.tray) {
        var type = platform.isOSX ? 'menubar' : 'tray';
        var alert = label ? '_alert' : '';
        var extension = platform.isOSX ? '.tiff' : '.png';
        win.tray.icon = 'images/icon_' + type + alert + extension;
      }
    }, 1000);
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

    settings.updateKey('windowState', state);
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

    if(!settings.startMinimized)
      win.show();
    else
      win.hide();
  }
};
