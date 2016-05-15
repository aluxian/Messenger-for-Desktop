var URL = require('url');

module.exports = {
  /**
   * Skip opening the link through Facebook.
   */
  skipFacebookRedirect: function(url) {
    var parsed = URL.parse(url, true);
    var hostMatches = parsed.hostname.indexOf('facebook.com') > -1 || parsed.hostname.indexOf('messenger.com') > -1;
    var pathMatches = parsed.pathname.indexOf('/l.php') > -1;

    if (hostMatches && pathMatches && parsed.query.u) {
      url = decodeURIComponent(parsed.query.u);
    }

    return url;
  },
  /**
   * Reload when computer wakes up
   * Tracks time difference, if the difference is greater than 3 minutes. The window reloads
   * If we know how long Messenger's session takes to timeout, perhaps use that time instead?
   */
  watchComputerWake: function(win, winBehaviour) {
    var time = new Date().getTime();
    setInterval(function() {
      var currentTime = new Date().getTime();
      var deltaTime = currentTime - time;
      if (deltaTime > 60000 * 3) {  // Time in ms. 3 minutes.
        // Do the reload
        winBehaviour.saveWindowState(win);
        win.reload();
        /**
         * Rerun the online check.
         * We might have changed locations and no longer have internet access
         */
        this.checkForOnline(win);
      }
	  time = currentTime;
    }, 1000);  // When the window is backgrounded, all functions run once per second.
  },
  /**
   * Reloads the app once every 10 seconds until the browser is in online mode.
   */
  checkForOnline: function(win) {
    var reloadIntervalId = setInterval(function() {
      if (win.window.navigator.onLine) {
        clearInterval(reloadIntervalId);
      } else {
        win.reload();
      }
    }, 10 * 1000);
  }
};
