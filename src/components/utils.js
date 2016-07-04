var URL = require('url');
var dispatcher = require('./dispatcher');

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
   * Verify th given URL to see if it is a facebook video call
   */
  isVideoCall: function(url) {
    var parsed = URL.parse(url, true);
    var pathMatches = parsed.pathname.indexOf('/videocall') > -1;

    if (pathMatches) {
      return true;
    }

    return false;
  },
  /**
   * Reload when computer wakes up.
   * Tracks time difference, if the difference is greater than 3 minutes. The window reloads.
   * If we know how long Messenger's session takes to timeout, perhaps use that time instead?
   * 
   * Notes:
   *   V8 caches date information, the current minute is updated at most, once per minute.
   *   This means if the system time jumps, it might take up to a minute before the time is
   *   represented by new Date().
   *
   *   It is unknown how often the hour is updated, but assumed that it is checked also once
   *   per minute and not cached for longer. 
   *
   *   The absolute local time difference is tracked, this will cause MFD to reload when you
   *   cross timezones also. This may or may not be desired, and could be fixed using
   *   getTimezoneOffset(), or using UTC time.
   *
   *   Although it's unlikely that the time will result in a reload more than once a minute
   *   due to time caching, it's possible that the bug/feature might be resolved in the future.
   *   It's because of that motivation that the timeout remains at once per second. If the time
   *   is cached, there is no performance impact, and if in the future it isn't cached. We can
   *   profile and fix it at a later time. Overall a quick refresh means we reload as fast as
   *   V8 will let us.
   */
  watchComputerWake: function(win, winBehaviour, document) {
    var time = new Date().getTime();
    setInterval(function() {
      var currentTime = new Date().getTime();
      var deltaTime = Math.abs(currentTime - time);
      if (deltaTime > 60000 * 3) {  // Time in ms. 3 minutes.
		// Remove the iframe to prevent interaction on an old session.
		dispatcher.trigger('offline');
        // Save the window state and reload.
        winBehaviour.saveWindowState(win);
        win.reload();
        /**
         * Rerun the online check.
         * We might have changed locations and no longer have internet access
         */
        this.checkForOnline(win);
      }
	  time = currentTime;
    }.bind(this), 1000);
  },
  /**
   * Reloads the app once every 10 seconds until the browser is in online mode.
   */
  checkForOnline: function(win) {
	// Check that we are not already running
	if(this.reloadIntervalId) {
		return;
	} else {
      if (this.serverReachable()) {
        // The browser has navigated, are we at the right place?
        frame = win.window.document.querySelector('iframe');
        childWindowLocation = frame.contentWindow.location;
        targetURL = URL.parse(frame.src);
        currentURL = URL.parse(childWindowLocation.href);
        if(targetURL.host != currentURL.host) {
          return; // The frame isn't on Facebook. Maybe it's navigated away, or it's on an about: no dns, page.
        }
        dispatcher.trigger('online');
      } else {
        dispatcher.trigger('offline');
        this.reloadIntervalId = setInterval(function() {
          if (this.serverReachable()) {
            clearInterval(this.reloadIntervalId);
            delete this.reloadIntervalId;
            win.reload();
          } 
        }.bind(this), 1000);
      }
	}
  },
  /**
   * Climbs the prototype hierachy looking for the top Object and returns it
   */
  getRootObject: function(object) {
	  while(object.__proto__) {
		  object = object.__proto__;
	  }
	  return object;
  },
  /**
   * Checks if two objects exist in the same context.
   * Climbs up to the root Object(){} and checks if the constructors are 
   * identical. If they are not, it's a separate global context 
   */
  areSameContext: function(object1, object2) {
	  root1 = this.getRootObject(object1);
	  root2 = this.getRootObject(object2);
	  return root1.constructor == root2.constructor;
  },
  /**
   * Checks if the passed in Object exists in the Node.JS context
   */
  isNodeContext: function(testObject) {
	  // Modules are loaded in node.js context 
	  var self = require('./utils');
	  return this.areSameContext(testObject, self);
  },

  /**
   * Checks if messenger is recheable using XML request
   * All credit goes to: gitawego (https://gist.github.com/gitawego/4250714)
   */
  serverReachable: function() {
    // IE vs. standard XHR creation
    var x = new ( window.ActiveXObject || XMLHttpRequest )( "Microsoft.XMLHTTP" ), s;
    x.open("HEAD", "https://www.messenger.com" + "/?rand=" + Math.random(), false);

    try {
      x.send();
      s = x.status;
      // Make sure the server is reachable
      return ( s >= 200 && s < 300 || s === 304 );
    // catch network & other problems
    } catch (e) {
      return false;
    }
  }
};
