import EventEmitter from 'events';
import keyMirror from 'keymirror';
import dialog from 'dialog';
import shell from 'shell';

import manifest from '../../../package.json';
import AutoUpdater from '../components/auto-updater';
import platform from '../utils/platform';
import prefs from '../utils/prefs';

const STATES = keyMirror({
  IDLE: null,
  UPDATE_CHECKING: null,
  UPDATE_AVAILABLE: null,
  UPDATE_DOWNLOADED: null
});

const IGNORED_ERRORS = {
  network: [
    'The request timed out.',
    'The network connection was lost.',
    'Se ha agotado el tiempo de espera.',
    'An SSL error has occurred and a secure connection to the server cannot be made.',
    'System.Net.WebException: The request was aborted: The connection was closed unexpectedly.',
    'System.Net.WebException: The underlying connection was closed: Could not establish trust'
      + 'relationship for the SSL/TLS secure channel.',
    'System.Net.WebException: The remote name could not be resolved:',
    'System.Net.WebException: Unable to connect to the remote server',
    'Update download failed',
    'getaddrinfo EAI_AGAIN',
    'getaddrinfo ENOTFOUND',
    'connect ETIMEDOUT'
  ],
  multiInstance: [
    'System.Exception: Couldn\'t acquire lock, is another instance running'
  ]
};

class AutoUpdateManager extends EventEmitter {

  constructor(manifest, options, mainWindowManager) {
    super();

    this.manifest = manifest;
    this.options = options;
    this.mainWindowManager = mainWindowManager;

    this.enabled = !this.options.mas && prefs.get('updates-auto-check');
    this.state = STATES.IDLE;
    this.states = STATES;

    this.latestVersion = null;
    this.latestDownloadUrl = null;
  }

  init() {
    log('starting auto updater');
    this.initFeedUrl();
    this.initErrorListener();
    this.initStateListeners();
    this.initVersionListener();
    this.initDownloadListener();
  }

  initFeedUrl() {
    let feedUrl = this.manifest.updater.urls[process.platform]
      .replace(/%CURRENT_VERSION%/g, this.manifest.version)
      .replace(/%CHANNEL%/g, prefs.get('updates-channel'));

    if (this.options.portable) {
      feedUrl += '/portable';
    }

    log('updater feed url:', feedUrl);
    AutoUpdater.setFeedURL(feedUrl);
  }

  initErrorListener() {
    AutoUpdater.on('error', (err) => {
      log('auto updater error');
      if (err.message && (
        IGNORED_ERRORS.network.find(msg => err.message.includes(msg))
        || IGNORED_ERRORS.multiInstance.find(msg => err.message.includes(msg))
      )) {
        log(err);
      } else {
        logError(err);
      }
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
    if (platform.isWin && !this.options.portable) {
      AutoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
          type: 'question',
          message: 'A new version of ' + manifest.productName + ' has been downloaded.',
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

    this.enabled = !this.options.mas && check;
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
    } else if (platform.isWin && this.options.portable) {
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
      detail: 'You are using the latest version: ' + this.manifest.version,
      buttons: ['OK']
    }, function() {});
  }

  onCheckError(err) {
    log('onCheckError:', err);
    let detailMessage;

    if (err.message && IGNORED_ERRORS.network.find(msg => err.message.includes(msg))) {
      detailMessage = manifest.productName + ' could not connect to the updates server.'
        + ' Please make sure you have a working internet connection.'
        + '\n\nERR: ' + err.message;
    } else if (err.message && IGNORED_ERRORS.multiInstance.find(msg => err.message.includes(msg))) {
      detailMessage = manifest.productName + ' could not acquire a lock.'
        + ' Is another instance of ' + manifest.productName + ' running or is another app using its files?'
        + '\n\nERR: ' + err.message;
    } else {
      detailMessage = err.message;
    }

    dialog.showMessageBox({
      type: 'error',
      message: 'Error while checking for update.',
      detail: detailMessage,
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
    if (this.mainWindowManager) {
      this.mainWindowManager.updateInProgress = true;
      AutoUpdater.quitAndInstall();
    } else {
      logError(new Error('cannot quit to install update'));
    }
  }

}

export default AutoUpdateManager;
