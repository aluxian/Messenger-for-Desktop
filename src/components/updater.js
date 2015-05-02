var gui = window.require('nw.gui');
var platform = require('./platform');
var request = require('request');
var semver = require('semver');

module.exports = {
  /**
   * Check if there's a new version available.
   */
  check: function(manifest, callback) {
    request(manifest.manifestUrl, function(error, response, body) {
      if (error) {
        return callback(error);
      }

      var newManifest = JSON.parse(body);
      var newVersionExists = semver.gt(newManifest.version, manifest.version);

      callback(null, newVersionExists, newManifest);
    });
  },

  /**
   * Show a dialog to ask the user to update.
   */
  prompt: function(win, error, newVersionExists, newManifest) {
    if (error) {
      console.error(error);
      return win.window.alert('Error while trying to update: ' + error);
    }

    if (newVersionExists) {
      var updateMessage = 'There\'s a new version available (' + newManifest.version + '). Would you like to download the update now?';

      if (win.window.confirm(updateMessage)) {
        gui.Shell.openExternal(newManifest.packages[platform.name]);
        gui.App.quit();
      }
    }
  },

  /**
   * Check for update and ask the user to update.
   */
  checkAndPrompt: function(manifest, win) {
    this.check(manifest, this.prompt.bind(this, win));
  }
};
