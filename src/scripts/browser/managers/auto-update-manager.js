import EventEmitter from 'events';
import keyMirror from 'keymirror';
import dialog from 'dialog';
import shell from 'shell';

import AutoUpdater from 'browser/components/auto-updater';
import platform from 'common/utils/platform';
import prefs from 'browser/utils/prefs';

const STATES = keyMirror({
  IDLE: null,
  UPDATE_CHECKING: null,
  UPDATE_AVAILABLE: null,
  UPDATE_DOWNLOADED: null
});

class AutoUpdateManager extends EventEmitter {

  constructor(mainWindowManager) {
    super();

    this.mainWindowManager = mainWindowManager;
    this.enabled = !global.options.mas && prefs.get('updates-auto-check');

    this.state = STATES.IDLE;
    this.states = STATES;

    this.latestVersion = null;
    this.latestDownloadUrl = null;
  }

  init() {
    log('starting auto updater');
    try {
      this.initFeedUrl();
      this.initErrorListener();
      this.initStateListeners();
      this.initVersionListener();
      this.initDownloadListener();
    } catch (err) {
      const isSignatureErr = err.message == 'Could not get code signature for running application';
      const isKnownError = isSignatureErr;
      if (global.manifest.dev && isKnownError) {
        logError(err.message);
      } else {
        throw err;
      }
    }
  }

  initFeedUrl() {
    let feedUrl = global.manifest.updater.urls[process.platform]
      .replace(/%CURRENT_VERSION%/g, global.manifest.version)
      .replace(/%CHANNEL%/g, prefs.get('updates-channel'));

    if (global.options.portable) {
      feedUrl += '/portable';
    }

    log('updater feed url:', feedUrl);
    AutoUpdater.setFeedURL(feedUrl);
  }

  initErrorListener() {
    AutoUpdater.on('error', (err) => {
      log('auto updater error');
      logError(err, true);
    });
  }

  initStateListeners() {
    const eventToStateMap = {
      'error': STATES.IDLE,
      'checking-for-update': STATES.UPDATE_CHECKING,
      'update-available': STATES.UPDATE_AVAILABLE,
      'update-not-available': STATES.IDLE,
      'update-downloaded': STATES.UPDATE_DOWNLOADED
    };

    for (let [eventName, state] of Object.entries(eventToStateMap)) {
      AutoUpdater.on(eventName, () => this.state = state);
    }
  }

  initVersionListener() {
    AutoUpdater.on('update-available', (newVersion, downloadUrl) => {
      this.latestVersion = newVersion;
      this.latestDownloadUrl = downloadUrl;
    });
  }

  initDownloadListener() {
    if (platform.isWindows && !global.options.portable) {
      AutoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
          type: 'question',
          message: 'A new version of ' + global.manifest.productName + ' has been downloaded.',
          detail: 'Would you like to restart the app and install the update? You can do this later from the App menu.',
          buttons: ['Later', 'Update']
        }, (response) => {
          if (response === 1) {
            log('user clicked Update');
            this.quitAndInstall();
          }
        });
      });
    }
  }

  handleMenuCheckForUpdate() {
    this.checkForUpdate(false);
  }

  handleMenuUpdateAvailable() {
    this.onCheckUpdateAvailable(this.latestVersion, this.latestDownloadUrl);
  }

  handleMenuUpdateDownloaded() {
    this.quitAndInstall();
  }

  setAutoCheck(check) {
    if (this.enabled === check) {
      log('update checker already', check ? 'enabled' : 'disabled');
      return; // same state
    }

    this.enabled = !global.options.mas && check;
    if (this.enabled) { // disabled -> enabled
      log('enabling auto update checker');
      this.scheduleUpdateChecks();
    } else if (this.scheduledCheckerId) {  // enabled -> disabled
      log('disabling auto update checker');
      clearInterval(this.scheduledCheckerId);
      this.scheduledCheckerId = null;
    }
  }

  onCheckUpdateAvailable(newVersion, downloadUrl) {
    log('onCheckUpdateAvailable', 'newVersion:', newVersion, 'downloadUrl:', downloadUrl);
    if (platform.isLinux) {
      dialog.showMessageBox({
        type: 'info',
        message: 'A new version is available: ' + newVersion,
        detail: 'Use your package manager to update, or click Download to get the new package.',
        buttons: ['OK', 'Download']
      }, function(response) {
        if (response === 1) {
          log('user clicked Download, opening url', downloadUrl);
          shell.openExternal(downloadUrl);
        }
      });
    } else if (platform.isWindows && global.options.portable) {
      dialog.showMessageBox({
        type: 'info',
        message: 'A new version is available: ' + newVersion,
        detail: 'Click Download to get a portable zip with the new version.',
        buttons: ['OK', 'Download']
      }, function(response) {
        if (response === 1) {
          log('user clicked Download, opening url', downloadUrl);
          shell.openExternal(downloadUrl);
        }
      });
    } else {
      dialog.showMessageBox({
        type: 'info',
        message: 'A new version is available.',
        detail: 'It will start downloading in the background.',
        buttons: ['OK']
      }, function() {});
    }
  }

  onCheckUpdateNotAvailable() {
    log('onCheckUpdateNotAvailable');
    dialog.showMessageBox({
      type: 'info',
      message: 'No update available.',
      detail: 'You are using the latest version: ' + global.manifest.version,
      buttons: ['OK']
    }, function() {});
  }

  onCheckError(err) {
    log('onCheckError:', err);
    dialog.showMessageBox({
      type: 'error',
      message: 'Error while checking for update.',
      detail: global.manifest.productName + ' could not connect to the updates server.'
        + ' Please make sure you have a working internet connection and try again.'
        + '\n\nERR: ' + (err.message || '').substr(0, 1024),
      buttons: ['OK']
    }, function() {});
  }

  scheduleUpdateChecks() {
    const checkInterval = 1000 * 60 * 60 * 4; // 4 hours
    log('scheduling update checks every', checkInterval, 'ms');
    this.scheduledCheckerId = setInterval(::this.checkForUpdate, checkInterval);
    this.checkForUpdate();
  }

  checkForUpdate(silent = true) {
    log('checking for update...');
    AutoUpdater.checkForUpdates();

    if (!silent) {
      const onCheck = {};

      const removeListeners = () => {
        AutoUpdater.removeListener('update-available', onCheck.updateAvailable);
        AutoUpdater.removeListener('update-not-available', onCheck.updateNotAvailable);
        AutoUpdater.removeListener('error', onCheck.error);
      };

      onCheck.updateAvailable = () => {
        this.onCheckUpdateAvailable.apply(this, arguments);
        removeListeners();
      };

      onCheck.updateNotAvailable = () => {
        this.onCheckUpdateNotAvailable.apply(this, arguments);
        removeListeners();
      };

      onCheck.error = () => {
        this.onCheckError.apply(this, arguments);
        removeListeners();
      };

      AutoUpdater.once('update-available', onCheck.updateAvailable);
      AutoUpdater.once('update-not-available', onCheck.updateNotAvailable);
      AutoUpdater.once('error', onCheck.error);
    }
  }

  quitAndInstall() {
    this.mainWindowManager.updateInProgress = true;
    AutoUpdater.quitAndInstall();
  }

}

export default AutoUpdateManager;
