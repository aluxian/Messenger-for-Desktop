var gui = require('nw.gui');
var win = gui.Window.get();

var manifest = require('./package.json');
var platform = require('./components/platform');
var updater = require('./components/updater');
var menus = require('./components/menus');
var themer = require('./components/themer');
var settings = require('./components/settings');
var windowBehaviour = require('./components/window-behaviour');
var notification = require('./components/notification');

// Ensure there's an app shortcut for toast notifications to work on Windows
if (platform.isWindows) {
  gui.App.createShortcut(process.env.APPDATA + "\\Microsoft\\Windows\\Start Menu\\Programs\\Messenger.lnk");
}

// Run as menu bar app
if (settings.asMenuBarAppOSX) {
  win.setShowInTaskbar(false);
  menus.loadTrayIcon(win);
}

// Window state
windowBehaviour.restoreWindowState(win);
windowBehaviour.bindWindowStateEvents(win);

// Check for update
updater.checkAndPrompt(manifest, win);

// Load the app menus
menus.loadMenuBar(win)
if (platform.isWindows) {
  menus.loadTrayIcon(win);
}

// Adjust the default behaviour of the main window
windowBehaviour.set(win);
windowBehaviour.setNewWinPolicy(win);
windowBehaviour.closeWithEscKey(win, document); // doesn't seem to work

// Inject logic into the app when it's loaded
var iframe = document.querySelector('iframe');
iframe.onload = function() {
  // Load the theming module
  themer.apply(iframe.contentDocument);

  // Inject a callback in the notification API
  notification.inject(iframe.contentWindow, win);

  // Add a context menu
  menus.injectContextMenu(win, iframe.contentWindow, iframe.contentDocument);

  // Bind native events to the content window
  windowBehaviour.bindEvents(win, iframe.contentWindow);

  // Watch the iframe periodically to sync the badge and the title
  windowBehaviour.syncBadgeAndTitle(win, document, iframe.contentDocument);
};
