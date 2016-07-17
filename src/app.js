var gui = require('nw.gui');
var win = gui.Window.get();

var platform = require('./components/platform');
var updater = require('./components/updater');
var menus = require('./components/menus');
var themer = require('./components/themer');
var settings = require('./components/settings');
var windowBehaviour = require('./components/window-behaviour');
var notification = require('./components/notification');
var dispatcher = require('./components/dispatcher');
var blockSeen = require('./components/block-seen');
var utils = require('./components/utils');

// Add dispatcher events
dispatcher.addEventListener('win.alert', function(data) {
  data.win.window.alert(data.message);
});

dispatcher.addEventListener('win.confirm', function(data) {
  data.callback(data.win.window.confirm(data.message));
});

// Window state
windowBehaviour.restoreWindowState(win);
windowBehaviour.bindWindowStateEvents(win);

// Check for update
if (settings.checkUpdateOnLaunch) {
  updater.checkAndPrompt(gui.App.manifest, win, settings.updateToBeta);
}

// Run as menu bar app
if (settings.asMenuBarAppOSX) {
  win.setShowInTaskbar(false);
  menus.loadTrayIcon(win);
}

// Load the app menus
menus.loadMenuBar(win)
if (platform.isWindows || platform.isLinux) {
  menus.loadTrayIcon(win);
}

// Adjust the default behaviour of the main window
windowBehaviour.set(win);
windowBehaviour.setNewWinPolicy(win);

// Watch the system clock for computer coming out of sleep
utils.watchComputerWake(win, windowBehaviour, document);

// Inject logic into the app when it's loaded
var iframe = document.querySelector('iframe');
iframe.onload = function() {
  // Load the theming module
  themer.apply(iframe.contentDocument);

  // Inject a callback in the notification API
  notification.inject(iframe.contentWindow, win);

  // Add a context menu
  menus.injectContextMenu(win, document);
  //menus.injectContextMenu(win, iframe.contentDocument);

  // Bind native events to the content window
  windowBehaviour.bindEvents(win, iframe.contentWindow);

  // Watch the iframe periodically to sync the badge and the title
  windowBehaviour.syncBadgeAndTitle(win, document, iframe.contentDocument);

  // Listen for ESC key press
  windowBehaviour.closeWithEscKey(win, iframe.contentDocument);
  
  // Listen for offline event and remove the iframe.
  dispatcher.addEventListener('offline', function() {
	iframe = document.querySelector('iframe');
	if(iframe) {
		iframe.remove();
	}
  });
  
  dispatcher.addEventListener('online', function() {
	iframe = document.querySelector('iframe');
	if(iframe) {
		iframe.style.display = 'initial';
	}
  });

  // Block 'seen' and typing indicator
  if (settings.blockSeen) {
    blockSeen.set(true);
  }

  dispatcher.trigger('online');
};


// Reload the app periodically until it's in online state.
utils.checkForOnline(win);
