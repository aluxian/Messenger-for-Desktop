import EventEmitter from 'events';
import {app} from 'electron';

import prefs from 'browser/utils/prefs';

class AppListenersManager extends EventEmitter {

  constructor (mainWindowManager, autoUpdateManager) {
    super();
    this.mainWindowManager = mainWindowManager;
    this.autoUpdateManager = autoUpdateManager;
  }

  /**
   * Bind events to local methods.
   */
  set () {
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

}

export default AppListenersManager;
