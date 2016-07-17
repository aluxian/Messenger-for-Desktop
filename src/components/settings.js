var Store = require('jfs');
var path = require('path');
var gui = window.require('nw.gui');

// Proxy shim by @Swatinem
// Fork @ nevercast/proxy#mfd
var Proxy = require('harmony-proxy');

var DEFAULT_SETTINGS = {
  launchOnStartup: false,
  checkUpdateOnLaunch: true,
  openLinksInBrowser: true,
  autoHideSidebar: false,
  asMenuBarAppOSX: false,
  closeWithEscKey: false,
  startMinimized: false,
  blockSeen: false,
  windowState: {},
  theme: 'default',
  updateToBeta: false
};

var db = new Store(path.join(gui.App.dataPath, 'preferences.json'));
var settings = db.getSync('settings');
var watchers = {};

// Watch changes to the storage
settings.watch = function(name, callback) {
  if (!Array.isArray(watchers[name])) {
    watchers[name] = [];
  }

  watchers[name].push(callback);
};

// Save settings every time a change is made and notify watchers
var settings_proxy = new Proxy(settings, {
    set: function(target, prop, value) {
        Reflect.set(target, prop, value);

        db.save('settings', settings, function(err) {
          if (err) {
            console.error('Could not save settings', err);
          }
        });

        var keyWatchers = watchers[prop];

        // Call all the watcher functions for the changed key
        if (keyWatchers && keyWatchers.length) {
          for (var i = 0; i < keyWatchers.length; i++) {
            try {
              keyWatchers[i](value);
            } catch(ex) {
              console.error(ex);
              keyWatchers.splice(i--, 1);
            }
          }
        }
    }
});

// Ensure the default values exist
Object.keys(DEFAULT_SETTINGS).forEach(function(key) {
  if (!settings.hasOwnProperty(key)) {
    settings[key] = DEFAULT_SETTINGS[key];
  }
});

// Cross context settings manipulation.
settings_proxy.updateKey = function(key, value) {
	settings_proxy[key] = value;
}

module.exports = settings_proxy;
