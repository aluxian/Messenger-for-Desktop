import platform from '../utils/platform';
import keyMirror from 'keymirror';
import dialog from 'dialog';
import shell from 'shell';

import AutoUpdater from '../components/auto-updater';
import EventEmitter from 'events';

const STATES = keyMirror({
  IDLE: null,
  UPDATE_CHECKING: null,
  UPDATE_AVAILABLE: null,
  UPDATE_DOWNLOADED: null
});

class AutoUpdateManager extends EventEmitter {

  constructor(manifest, options, mainWindowManager) {
    super();

    this.manifest = manifest;
    this.options = options;
    this.mainWindowManager = mainWindowManager;

    this.enabled = !process.mas;
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
  }

  initFeedUrl() {
    let feedUrl = this.manifest.updater.urls[process.platform]
      .replace(/%CURRENT_VERSION%/g, this.manifest.version);

    if (this.options.portable) {
      feedUrl += '/portable';
    }

    log('updater feed url:', feedUrl);
    AutoUpdater.setFeedURL(feedUrl);
  }

  initErrorListener() {
    AutoUpdater.on('error', (ex) => {
      logError('auto updater error', ex);
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

  handleMenuCheckForUpdate() {
    this.checkForUpdate(false);
  }

  handleMenuUpdateAvailable() {
    this.onCheckUpdateAvailable(this.latestVersion, this.latestDownloadUrl);
  }

  handleMenuUpdateDownloaded() {
    this.quitAndInstall();
  }

  onCheckUpdateAvailable(newVersion, downloadUrl) {
    if (platform.isLinux) {
      dialog.showMessageBox({
        type: 'info',
        message: 'A new version is available: ' + newVersion,
        detail: 'Use your package manager to update, or click Download to get the new package.',
        buttons: ['OK', 'Download']
      }, function(response) {
        if (response === 1) {
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
          shell.openExternal(downloadUrl);
        }
      });
    } else {
      dialog.showMessageBox({
        type: 'info',
        message: 'A new version is available.',
        detail: 'It\'ll be automatically downloaded in the background.',
        buttons: ['OK']
      }, function() {});
    }
    this.removeCheckListeners();
  }

  onCheckUpdateNotAvailable() {
    dialog.showMessageBox({
      type: 'info',
      message: 'No update available.',
      detail: 'You\'re using the latest version: ' + this.manifest.version,
      buttons: ['OK']
    }, function() {});
    this.removeCheckListeners();
  }

  onCheckError(err) {
    dialog.showMessageBox({
      type: 'warning',
      message: 'Error while checking for update.',
      detail: err.message,
      buttons: ['OK']
    }, function() {});
    this.removeCheckListeners();
  }

  removeCheckListeners() {
    AutoUpdater.removeListener('update-available', ::this.onCheckUpdateAvailable);
    AutoUpdater.removeListener('update-not-available', ::this.onCheckUpdateNotAvailable);
    AutoUpdater.removeListener('error', ::this.onCheckError);
  }

  scheduleUpdateChecks() {
    setInterval(::this.checkForUpdate, 1000 * 60 * 60 * 4); // 4 hours
    this.checkForUpdate();
  }

  checkForUpdate(silent = true) {
    AutoUpdater.checkForUpdates();
    if (!silent) {
      AutoUpdater.once('update-available', ::this.onCheckUpdateAvailable);
      AutoUpdater.once('update-not-available', ::this.onCheckUpdateNotAvailable);
      AutoUpdater.once('error', ::this.onCheckError);
    }
  }

  quitAndInstall() {
    if (this.mainWindowManager) {
      this.mainWindowManager.forceClose = true;
      AutoUpdater.quitAndInstall();
    } else {
      logError(new Error('cannot quit to install update'));
    }
  }

}

export default AutoUpdateManager;
