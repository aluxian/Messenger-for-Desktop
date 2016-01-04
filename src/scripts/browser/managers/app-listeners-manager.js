import platform from '../utils/platform';
import prefs from '../utils/prefs';
import app from 'app';

import EventEmitter from 'events';

class AppListenersManager extends EventEmitter {

  constructor(mainWindowManager, autoUpdateManager, trayManager) {
    super();
    this.mainWindowManager = mainWindowManager;
    this.autoUpdateManager = autoUpdateManager;
    this.trayManager = trayManager;
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
    // Close the main window instead of hiding it
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
      event.preventDefault();
      this.autoUpdateManager.quitAndInstall();
    }
  }

  /**
   * Called when the 'window-all-closed' event is emitted.
   */
  onAllWindowsClosed() {
    log('all windows closed');

    // Quit the app if all windows are closed
    app.quit();

    // Inform the user the app is still running
    if (platform.isWin && !prefs.get('quit-behaviour-taught')) {
      this.trayManager.tray.displayBalloon({
        title: 'Whatsie',
        content: 'Whatsie keeps running in the tray until you quit it.'
      });
      prefs.set('quit-behaviour-taught', true);
    }
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
