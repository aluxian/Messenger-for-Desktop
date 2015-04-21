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
    win.on('close', function(quit) {
      if (quit) {
        win.close(true);
      } else {
        // On Linux, minimize it instead
        if (platform.isLinux) {
          win.minimize();
        } else {
          win.hide();
        }
      }
    });

    // Open external urls in the browser
    win.on('new-win-policy', function(frame, url, policy) {
      gui.Shell.openExternal(url);
      policy.ignore();
    });
  }
};
