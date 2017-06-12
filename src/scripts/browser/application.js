import {app, Menu} from 'electron';

import prefs from 'browser/utils/prefs';
import AutoUpdater from 'browser/components/auto-updater';
import {findItemByLabel} from 'browser/menus/utils';
import mainMenuTemplate from 'browser/menus/main';

import MainWindowManager from 'browser/managers/main-window-manager';
import AutoUpdateManager from 'browser/managers/auto-update-manager';
import AutoLauncher from 'browser/components/auto-launcher';
import TrayManager from 'browser/managers/tray-manager';

class Application {

  constructor () {
    this.unreadNotifsCount = 0;
    this.cfuVisibleItem = null;
  }

  init () {
    // Create the main app window
    this.mainWindowManager = new MainWindowManager();
    this.mainWindowManager.createWindow();
    this.mainWindowManager.initWindow();

    // Enable the auto updater
    this.autoUpdateManager = new AutoUpdateManager(this.mainWindowManager);
    if (this.autoUpdateManager.enabled) {
      this.autoUpdateManager.init();
      this.autoUpdateManager.scheduleUpdateChecks();
    }

    // Create and set the main menu
    Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenuTemplate));
    this.setMenuAutoUpdaterListeners();

    // Others
    this.autoLauncher = new AutoLauncher();

    // Create and set the tray icon
    this.trayManager = new TrayManager(this.mainWindowManager);
    this.mainWindowManager.setTrayManager(this.trayManager);

    // Bind app events to local methods
    app.on('before-quit', ::this.onBeforeQuit);
    app.on('will-quit', ::this.onWillQuit);
    app.on('window-all-closed', ::this.onAllWindowsClosed);
    app.on('activate', ::this.onActivate);
  }

  /**
   * Called when the 'before-quit' event is emitted.
   */
  onBeforeQuit () {
    // Set a flag to close the main window instead of hiding it
    log('before quit');
    if (this.mainWindowManager) {
      this.mainWindowManager.forceClose = true;
    }
  }

  /**
   * Called when the 'will-quit' event is emitted.
   */
  onWillQuit (event) {
    // Update the app before actually quitting
    log('will quit');
    const hasUpdate = this.autoUpdateManager.state === this.autoUpdateManager.states.UPDATE_DOWNLOADED;
    const isUpdating = this.mainWindowManager.updateInProgress;
    try {
      if (hasUpdate && !isUpdating) {
        log('has update downloaded, installing it before quitting');
        event.preventDefault();
        prefs.setSync('launch-quit', true);
        prefs.setSync('notify-app-updated', true);
        setTimeout(() => {
          log('timeout over');
          this.autoUpdateManager.quitAndInstall();
        }, 200);
      }
    } catch (err) {
      logFatal(err);
    }
  }

  /**
   * Called when the 'window-all-closed' event is emitted.
   */
  onAllWindowsClosed () {
    // Quit the app if all windows are closed
    log('all windows closed');
    app.quit();
  }

  /**
   * Called when the 'activate' event is emitted.
   */
  onActivate (event, hasVisibleWindows) {
    // Reopen the main window on dock clicks (OS X)
    log('activate app, hasVisibleWindows', hasVisibleWindows);
    if (!hasVisibleWindows && this.mainWindowManager) {
      this.mainWindowManager.showOrCreate();
    }
  }

  /**
   * Set listeners related to the update check flow.
   */
  setMenuAutoUpdaterListeners () {
    const menu = Menu.getApplicationMenu();

    if (!this.cfuVisibleItem) {
      this.cfuVisibleItem = findItemByLabel(menu.items, 'Check for Update...');
    }

    const eventToLabelMap = {
      'error': 'Check for Update...',
      'checking-for-update': 'Checking for Update...',
      'update-available': 'Download Update...',
      'update-not-available': 'Check for Update...',
      'update-downloaded': 'Restart and Install Update...'
    };

    for (let [eventName, itemLabel] of Object.entries(eventToLabelMap)) {
      AutoUpdater.on(eventName, () => {
        log('auto updater on:', eventName, 'params:', ...arguments);
        this.cfuVisibleItem.visible = false;
        this.cfuVisibleItem = findItemByLabel(menu.items, itemLabel);
        this.cfuVisibleItem.visible = true;
      });
    }
  }

}

export default Application;
