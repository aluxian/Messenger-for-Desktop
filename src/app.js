var gui = require('nw.gui');
var win = gui.Window.get();

var semver = require('./vendor/semver');
var manifest = require('./package.json');

var platform = process.platform;
platform = /^win/.test(platform) ? 'win32'
         : /^darwin/.test(platform) ? 'osx64'
         : 'linux' + (process.arch == 'ia32' ? '32' : '64');

var isOSX = platform === 'osx64';
var isWindows = platform === 'win32';
var isLinux = platform.indexOf('linux') === 0;

// Check for update
var req = new XMLHttpRequest();
req.onload = function() {
  if (req.status < 200 || req.status > 299) {
    return callback(new Error(req.status));
  }

  try {
    var data = JSON.parse(req.responseText);
    checkNewVersion(null, semver.gt(data.version, manifest.version), data);
  } catch(error) {
    callback(error);
  }
};
req.open('get', manifest.manifestUrl, true);
req.send();

function checkNewVersion(error, newVersionExists, newManifest) {
  if (error) {
    return alert('Error while trying to update: ' + error);
  }

  if (newVersionExists) {
    var updateMessage = 'There\'s a new version available (' + newManifest.version + ').'
                        + ' Would you like to download the update now?';

    if (confirm(updateMessage)) {
      gui.Shell.openExternal(newManifest.packages[platform]);
    }
  }
}

// Create the app menu
var mainMenu = new gui.Menu({ type: 'menubar' });

if (isLinux) {
  var fileMenu = new gui.Menu();
  fileMenu.append(new gui.MenuItem({ label: 'Quit', click: function() { win.close(true); } }));

  mainMenu.append(new gui.MenuItem({ label: 'File', submenu: fileMenu }));
}

if (mainMenu.createMacBuiltin) {
  mainMenu.createMacBuiltin('Messenger');
}

win.menu = mainMenu;

// Windows
if (isWindows) {
  // Create a tray icon
  var tray = new gui.Tray({ title: 'Messenger', tooltip: 'Messenger for Desktop', icon: 'icon.png' });
  tray.on('click', function() {
    win.show();
  });

  // Add a menu to the tray
  var trayMenu = new gui.Menu();
  trayMenu.append(new gui.MenuItem({ label: 'Open Messenger', click: function() { win.show(); } }));
  trayMenu.append(new gui.MenuItem({ label: 'Quit Messenger', click: function() { win.close(true); } }));
  tray.menu = trayMenu;
}

// OS X
if (isOSX) {
  // Re-show the window when the dock icon is pressed
  gui.App.on('reopen', function() {
    win.show();
  });
}

// Don't quit the app when the window is closed
win.on('close', function(quit) {
  if (quit) {
    win.close(true);
  } else {
    // On Linux, just minimize the window
    if (isLinux) {
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

// Listen for DOM load
window.onload = function() {
  var app = document.getElementById('app');
  var titleRegExp = /\((\d)\)/;

  // Watch the iframe every 250ms
  setInterval(function() {
    // Sync the title
    document.title = app.contentDocument.title;

    // Update the badge
    var match = titleRegExp.exec(document.title);
    var label = match && match[1] || '';
    win.setBadgeLabel(label);
  }, 250);
}
