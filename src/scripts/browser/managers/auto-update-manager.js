import platform from '../utils/platform';
import keyMirror from 'keymirror';
import dialog from 'dialog';
import shell from 'shell';
import app from 'app';

import AutoUpdater from '../components/auto-updater';
import EventEmitter from 'events';

const STATES = keyMirror({
  IDLE: null,
  UPDATE_CHECKING: null,
  UPDATE_AVAILABLE: null,
  UPDATE_DOWNLOADED: null
});

class AutoUpdateManager extends EventEmitter {

  constructor(manifest, options) {
    super();
    this.manifest = manifest;
    this.options = options;
    this.enabled = !process.mas;
    this.state = STATES.IDLE;
    this.states = STATES;
  }

  init() {
    log('starting auto updater');
    this.setFeedUrl();
    this.setErrorListener();
    this.setStateListeners();
  }

  setFeedUrl() {
    let feedUrl = this.manifest.updater.urls[process.platform]
      .replace(/%CURRENT_VERSION%/g, this.manifest.version);

    if (platform.isWin) {
      app.setAppUserModelId(this.manifest.win.userModelId);
      if (this.options.portable) {
        feedUrl += '/portable';
      }
    }

    AutoUpdater.setFeedURL(feedUrl);
  }

  setErrorListener() {
    AutoUpdater.on('error', ex => {
      logError('auto updater error', ex);
    });
  }

  setStateListeners() {
    AutoUpdater.on('error', () => {
      this.state = STATES.IDLE;
    });

    AutoUpdater.on('checking-for-update', () => {
      this.state = STATES.UPDATE_CHECKING;
    });

    AutoUpdater.on('update-available', () => {
      this.state = STATES.UPDATE_AVAILABLE;
    });

    AutoUpdater.on('update-not-available', () => {
      this.state = STATES.IDLE;
    });

    AutoUpdater.on('update-downloaded', () => {
      this.state = STATES.UPDATE_DOWNLOADED;
    });
  }

  onClick() {
    switch (this.state) {
      case STATES.IDLE:
        this.checkForUpdate(false);
        break;

      case STATES.UPDATE_AVAILABLE:
        if (platform.isLinux || platform.isWin && this.options.portable) {
          this.onCheckUpdateAvailable();
        } else {
          logError('unexpected check-for-update click in state', this.state);
        }
        break;

      case STATES.UPDATE_DOWNLOADED:
        AutoUpdater.quitAndInstall();
        break;

      default:
        logError('unknown state', this.state);
    }
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
    AutoUpdater.quitAndInstall();
  }

}

export default AutoUpdateManager;
