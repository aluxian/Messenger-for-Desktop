var gui = require('nw.gui');
var async = require('./node_modules/async/lib/async');

var win = gui.Window.get();
var isOSX = /^darwin/.test(process.platform);

var copyPath, execPath;
var updater = (function() {
  var manifest = require('./package.json');
  var updater = require('node-webkit-updater');
  return new updater(manifest);
})();

// Auto updater
if (gui.App.argv.length) { // args are passed when the app is launched from the temp dir during update
  // The new app (in temp) will copy itself to the original folder, overwriting the old app
  copyPath = gui.App.argv[0];
  execPath = gui.App.argv[1];

  //alert('copyPath=' + copyPath + ' execPa=' + execPath);

  // Replace the old app
  updater.install(copyPath, function(error) {
    //alert('install done ' + error)

    if (!error) {
      // Run the new app and quit the temporary instance
      gui.Shell.openItem(execPath);
      gui.App.quit();
    } else {
      //alert('Error while finishing update: ' + error);
    }
  });
} else { // if no arguments were passed to the app
  async.waterfall([
    // See if a check has already been made in the past hour
    function(callback) {
      var delay = 1 * 60 * 60 * 1000; // 1 hour
      var lastCheck = null;//localStorage.lastCheckUpdate;
      localStorage.lastCheckUpdate = Date.now();

      if (lastCheck && lastCheck + delay > Date.now()) {
        return callback('skip'); // false error to skip the rest
      }

      callback();
    },

    // Check if there's a new version available
    function(callback) {
      updater.checkNewVersion(callback);
    },

    // If there is a new release, download it to a temp directory
    function(newVersionExists, manifest, callback) {
      var updateMsg = 'There\'s a new version available (' + manifest.version + '). Would you like to update now?';

      if (!newVersionExists || !confirm(updateMsg)) {
        return callback('skip'); // false error to skip the rest
      }

      //alert('downloading ' + manifest.version);

      updater.download(function(error, filename) {
        callback(error, filename, manifest);
      }, manifest);
    },

    // Unpack the downloaded package
    function(filename, manifest, callback) {
      //alert('unpacking ' + filename);
      updater.unpack(filename, callback, manifest);
    },

    // Run the new app from temp and kill the current one
    function(newAppPath, callback) {
      //alert('installing ' + newAppPath + '  1 ' + updater.getAppPath() + ' 2 ' + updater.getAppExec());
      updater.runInstaller(newAppPath, [updater.getAppPath(), updater.getAppExec()], {});
      gui.App.quit();
    }
  ], function(error) {
    if (error && error != 'skip') {
      //alert('Error while trying to update: ' + error);
    }
  });
}

// Create the app menu
var menu = new gui.Menu({ type: 'menubar' });
if (menu.createMacBuiltin) {
  menu.createMacBuiltin('Messenger');
}
win.menu = menu;

// OS X
if (isOSX) {
  // Don't quit the app when the window is closed
  win.on('close', function(quit) {
    if (quit) {
      win.close(true);
    } else {
      win.hide();
    }
  });

  // Re-show the window when the dock icon is pressed
  gui.App.on('reopen', function() {
    win.show();
  });
}

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
