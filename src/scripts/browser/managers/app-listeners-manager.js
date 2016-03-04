import app from 'app';

import EventEmitter from 'events';

class AppListenersManager extends EventEmitter {

  constructor(mainWindowManager, autoUpdateManager) {
    super();
    this.mainWindowManager = mainWindowManager;
    this.autoUpdateManager = autoUpdateManager;
  }

  /**
   * Bind events to local methods.
   */
  set() {
    app.on('before-quit', ::this.onBeforeQuit);
    app.on('will-quit', ::this.onWillQuit);
    app.on('window-all-closed', ::this.onAllWindowsClosed);
    app.on('activate', ::this.onActivate);
  }

  /**
   * Called when the 'before-quit' event is emitted.
   */
  onBeforeQuit() {
    // Set a flag to close the main window instead of hiding it
    log('before quit');
    if (this.mainWindowManager) {
      this.mainWindowManager.forceClose = true;
    }
  }

  /**
   * Called when the 'will-quit' event is emitted.
   */
  onWillQuit(event) {
    // Update the app before actually quitting
    log('will quit');
    if (this.autoUpdateManager.state == this.autoUpdateManager.states.UPDATE_DOWNLOADED) {
      log('has update downloaded, installing it before quitting');
      event.preventDefault();
      this.autoUpdateManager.state = this.autoUpdateManager.states.IDLE;
      this.autoUpdateManager.quitAndInstall();
    }
  }

  /**
   * Called when the 'window-all-closed' event is emitted.
   */
  onAllWindowsClosed() {
    // Quit the app if all windows are closed
    log('all windows closed');
    app.quit();
  }

  /**
   * Called when the 'activate' event is emitted.
   */
  onActivate(event, hasVisibleWindows) {
    // Reopen the main window on dock clicks (OS X)
    log('activate app, hasVisibleWindows', hasVisibleWindows);
    if (!hasVisibleWindows) {
      if (this.mainWindowManager) {
        this.mainWindowManager.window.show();
      } else {
        this.mainWindowManager.create();
      }
    }
  }

}

export default AppListenersManager;
