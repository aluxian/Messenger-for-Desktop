import {ipcMain} from 'electron';
import EventEmitter from 'events';

class IpcListenersManager extends EventEmitter {

  constructor (mainWindowManager) {
    super();
    this.mainWindowManager = mainWindowManager;
  }

  /**
   * Bind events to local methods.
   */
  set () {
    ipcMain.on('notif-count', ::this.onNotifCount);
    ipcMain.on('close-window', ::this.onCloseWindow);
  }

  /**
   * Called when the 'notif-count' event is received.
   */
  onNotifCount (event, count, badgeDataUrl) {
    log('on renderer notif-count', count, !!badgeDataUrl || null);
    clearTimeout(this._delayedRemoveBadge);
    if (count) {
      this.mainWindowManager.notifCountChanged(count, badgeDataUrl);
    } else {
      this._delayedRemoveBadge = setTimeout(() => {
        this.mainWindowManager.notifCountChanged(count, badgeDataUrl);
      }, 1500);
    }
  }

  /**
   * Called when the 'close-window' event is received.
   */
  onCloseWindow () {
    this.mainWindowManager.window.close();
  }

}

export default IpcListenersManager;
