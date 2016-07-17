var gui = window.require('nw.gui');
var platform = require('./platform');
var dispatcher = require('./dispatcher');
var request = require('request');
var semver = require('semver');

module.exports = {
  /**
   * Check if there's a new version available.
   */
  check: function(manifest, callback, beta) {
    var manifestURL = manifest.manifestUrl;

    if(beta) {
      manifestURL = manifest.manifestUrlBeta;
    }

    request(manifestURL, function(error, response, body) {
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
  prompt: function(win, ignoreError, error, newVersionExists, newManifest) {
    if (error) {
      if (!ignoreError) {
        dispatcher.trigger('win.alert', {
          win: win,
          message: 'Error while trying to update: ' + error
        });
      }

      return;
    }

    if (newVersionExists) {
      var updateMessage = 'There’s a new version available (' + newManifest.version + '). Would you like to download the update now?';

      dispatcher.trigger('win.confirm', {
        win: win,
        message: updateMessage,
        callback: function(result) {
          if (result) {
            gui.Shell.openExternal(newManifest.packages[platform.name]);
            gui.App.quit();
          }
        }
      });
    }
  },

  /**
   * Check for update and ask the user to update.
   */
  checkAndPrompt: function(manifest, win, beta) {
    this.check(manifest, this.prompt.bind(this, win, true), beta);
  }
};
