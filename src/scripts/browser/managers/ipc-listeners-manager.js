import {ipcMain} from 'electron';
import contextMenu from '../menus/context';
import prefs from '../utils/prefs';
import shell from 'shell';
import app from 'app';

import EventEmitter from 'events';
import BrowserWindow from 'browser-window';

class IpcListenersManager extends EventEmitter {

  constructor(notifManager, trayManager, mainWindowManager) {
    super();
    this.notifManager = notifManager;
    this.trayManager = trayManager;
    this.mainWindowManager = mainWindowManager;
  }

  /**
   * Bind events to local methods.
   */
  set() {
    ipcMain.on('notif-count', ::this.onNotifCount);
    ipcMain.on('context-menu', ::this.onContextMenu);
    ipcMain.on('close-window', ::this.onCloseWindow);
    ipcMain.on('open-url', ::this.onOpenUrl);
  }

  /**
   * Called when the 'notif-count' event is received.
   */
  onNotifCount(event, count) {
    log('on renderer notif-count', count);
    this.notifManager.unreadCount = count;

    // Set icon badge
    if (app.dock && app.dock.setBadge && prefs.get('show-notifications-badge')) {
      app.dock.setBadge(count);
    }

    // Update tray
    this.trayManager.unreadCountUpdated(count);
  }

  /**
   * Called when the 'context-menu' event is received.
   */
  onContextMenu(event, options) {
    const menu = contextMenu.create(options, this.mainWindowManager.window);
    if (menu) {
      log('opening context menu');
      setTimeout(() => {
        menu.popup(this.mainWindowManager.window);
      }, 50);
    }
  }

  /**
   * Called when the 'close-window' event is received.
   */
  onCloseWindow() {
    this.mainWindowManager.window.close();
  }

  /**
   * Called when the 'open-url' event is received.
   */
  onOpenUrl(event, url, options) {
    if (prefs.get('links-in-browser')) {
      log('on renderer open-url, externally', url);
      shell.openExternal(url);
    } else {
      log('on renderer open-url, new window', url);
      const newWindow = new BrowserWindow(options);
      newWindow.loadURL(url);
    }
  }

}

export default IpcListenersManager;
