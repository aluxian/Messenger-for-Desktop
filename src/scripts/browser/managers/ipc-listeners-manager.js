import {ipcMain} from 'electron';
import contextMenu from '../menus/context';
import prefs from '../utils/prefs';
import shell from 'shell';
import app from 'app';

import EventEmitter from 'events';
import BrowserWindow from 'browser-window';

class IpcListenersManager extends EventEmitter {

  constructor(notifManager, trayManager, mainWindowManager, nativeNotifier) {
    super();
    this.notifManager = notifManager;
    this.trayManager = trayManager;
    this.mainWindowManager = mainWindowManager;
    this.nativeNotifier = nativeNotifier;
  }

  /**
   * Bind events to local methods.
   */
  set() {
    ipcMain.on('notif-count', ::this.onNotifCount);
    ipcMain.on('context-menu', ::this.onContextMenu);
    ipcMain.on('open-url', ::this.onOpenUrl);

    ipcMain.on('osx-notif', () => {
      this.nativeNotifier.fireNotification({
        title: 'Title',
        subtitle: 'Subtitle',
        body: 'Body',
        tag: 'Tag',
        canReply: true,
        onClick: function(payload) {
          log('onClick', payload);
        },
        onCreate: function(err) {
          log('onCreate', err);
        }
      });
    });
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

}

export default IpcListenersManager;
