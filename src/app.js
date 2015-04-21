var gui = require('nw.gui');
var win = gui.Window.get();

var manifest = require('./package.json');
var platform = require('./utils/platform');
var updater = require('./utils/updater');
var menus = require('./utils/menus');
var windowBehaviour = require('./utils/window-behaviour');

// Check for update
updater.checkAndPrompt(manifest, window);

// Load the app menus
menus.loadMenuBar(win)
menus.loadTrayIcon(win);

// Adjust the default behaviour of the main window
windowBehaviour.set(win);

// Listen for DOM load
window.onload = function() {
  var app = document.getElementById('app');
  var titleRegExp = /\((\d)\)/;

  // Watch the iframe every 50ms
  setInterval(function() {
    // Sync the title
    document.title = app.contentDocument.title;

    // Update the badge
    var match = titleRegExp.exec(document.title);
    var label = match && match[1] || '';
    win.setBadgeLabel(label);
  }, 250);
};
