var gui = require('nw.gui');
var win = gui.Window.get();

var manifest = require('./package.json');
var platform = require('./utils/platform');
var updater = require('./utils/updater');
var menus = require('./utils/menus');
var themer = require('./utils/themer');
var windowBehaviour = require('./utils/window-behaviour');
var notification = require('./utils/notification');

// Ensure there's an app shortcut for toast notifications to work on Windows
if (platform.isWindows) {
  gui.App.createShortcut(process.env.APPDATA + "\\Microsoft\\Windows\\Start Menu\\Programs\\Messenger.lnk");
}

// Check for update
updater.checkAndPrompt(manifest, window);

// Load the app menus
menus.loadMenuBar(win)
menus.loadTrayIcon(win);

// Adjust the default behaviour of the main window
windowBehaviour.set(win);

// Listen for DOM load
window.onload = function() {
  var iframe = document.querySelector('iframe');

  // Load the theming module
  themer.apply(iframe.contentDocument);

  // Inject a callback in the notification API
  notification.injectClickCallback(iframe.contentWindow, win);

  // Add a context menu
  menus.injectContextMenu(win, iframe.contentWindow, iframe.contentDocument);

  // Watch the iframe periodically
  var titleRegExp = /\((\d)\)/;
  setInterval(function() {
    // Sync the title
    document.title = iframe.contentDocument.title;

    // Update the badge
    var match = titleRegExp.exec(document.title);
    var label = match && match[1] || '';
    win.setBadgeLabel(label);
  }, 50);
};
