import {app, ipcMain, shell, BrowserWindow, NativeImage} from 'electron';
import EventEmitter from 'events';

import contextMenu from 'browser/menus/context';
import platform from 'common/utils/platform';
import prefs from 'browser/utils/prefs';

class IpcListenersManager extends EventEmitter {

  constructor (notifManager, trayManager, mainWindowManager) {
    super();
    this.notifManager = notifManager;
    this.trayManager = trayManager;
    this.mainWindowManager = mainWindowManager;
  }

  /**
   * Bind events to local methods.
   */
  set () {
    ipcMain.on('notif-count', ::this.onNotifCount);
    ipcMain.on('context-menu', ::this.onContextMenu);
    ipcMain.on('close-window', ::this.onCloseWindow);
    ipcMain.on('open-url', ::this.onOpenUrl);
  }

  /**
   * Called when the 'notif-count' event is received.
   */
  onNotifCount (event, count, badgeDataUrl) {
    log('on renderer notif-count', count, !!badgeDataUrl || null);
    this.notifManager.unreadCount = count;

    // Set icon badge
    if (prefs.get('show-notifications-badge')) {
      if (platform.isWindows) {
        if (count) {
          const image = NativeImage.createFromDataUrl(badgeDataUrl);
          this.mainWindowManager.window.setOverlayIcon(image, count);
        } else {
          this.mainWindowManager.window.setOverlayIcon(null, '');
        }
      } else {
        app.setBadgeCount(parseInt(count, 10) || 0);
      }
    }

    // Update tray
    this.trayManager.unreadCountUpdated(count);

    // Update window title
    this.mainWindowManager.suffixWindowTitle(count ? ' (' + count + ')' : '');
  }

  /**
   * Called when the 'context-menu' event is received.
   */
  onContextMenu (event, options) {
    try {
      options = JSON.parse(options);
      const menu = contextMenu.create(options, this.mainWindowManager.window);
      if (menu) {
        log('opening context menu');
        setTimeout(() => {
          menu.popup(this.mainWindowManager.window);
        }, 50);
      }
    } catch (err) {
      logError(err);
    }
  }

  /**
   * Called when the 'close-window' event is received.
   */
  onCloseWindow () {
    this.mainWindowManager.window.close();
  }

  /**
   * Called when the 'open-url' event is received.
   */
  onOpenUrl (event, url, options) {
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
