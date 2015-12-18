import app from 'app';
import shell from 'shell';
import filer from './utils/filer';
import prefs from './utils/prefs';
import {ipcMain} from 'electron';
import path from 'path';

import menuTemplate from './menus/main';
import trayTemplate from './menus/tray';

import Menu from 'menu';
import Tray from 'tray';
import EventEmitter from 'events';
import BrowserWindow from 'browser-window';
import AppWindow from './app-window';

class Application extends EventEmitter {

  /**
   * Load components and create the main window.
   */
  constructor(manifest, options) {
    super();

    this.manifest = manifest;
    this.options = options;

    this.createAppMenu();
    this.createAppWindow();

    this.setAppEventListeners();
    this.setIpcEventListeners();

    // Restore the tray menu
    if (prefs.get('show-tray', false)) {
      this.createTrayMenu();
    }
  }

  /**
   * Create and set the default menu.
   */
  createAppMenu() {
    if (this.menu) {
      return;
    }

    this.menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(this.menu);
    log('app menu created');
  }

  /**
   * Create and set the default menu.
   */
  createTrayMenu() {
    if (this.tray) {
      return;
    }

    this.trayMenu = Menu.buildFromTemplate(trayTemplate);
    this.tray = new Tray(path.join(__dirname, '..', '..', 'images', 'icon_tray.png'));
    this.tray.setContextMenu(this.trayMenu);
    this.setTrayEventListeners();
    log('tray menu created');
  }

  /**
   * Create and show the main window.
   */
  createAppWindow() {
    if (this.mainWindow) {
      return;
    }

    this.mainWindow = new AppWindow(this.manifest);
    this.mainWindow.loadURL(filer.getHtmlFile('app.html'));
    this.mainWindow.on('closed', () => this.mainWindow = null);
  }

  /**
   * Listen to app events.
   */
  setAppEventListeners() {
    app.on('window-all-closed', ::this.onAllWindowsClosed);
    app.on('activate', ::this.onActivate);
  }

  /**
   * Called when the 'window-all-closed' event is emitted.
   */
  onAllWindowsClosed(event) {
    // Quit the app if all windows are closed
    log('all windows closed');
    app.quit();
  }

  /**
   * Called when the 'activate' event is emitted.
   */
  onActivate(event, hasVisibleWindows) {
    // Reopen the main window on dock clicks (OS X)
    log('activate app, hasVisibleWindows =', hasVisibleWindows);
    if (!hasVisibleWindows) {
      if (this.mainWindow) {
        this.mainWindow.window.show();
      } else {
        this.createAppWindow();
      }
    }
  }

  /**
   * Listen for tray events.
   */
  setTrayEventListeners() {
    if (!this.tray) {
      return;
    }

    // Bind events
    this.tray.on('click', ::this.onTrayClick);
  }

  /**
   * Called when the 'click' event is emitted on the tray menu.
   */
  onTrayClick(event) {
    // Show the main window
    log('tray click');
    if (this.mainWindow) {
      this.mainWindow.show();
    }
  }

  /**
   * Listen for IPC events.
   */
  setIpcEventListeners() {
    // Notifications count
    ipcMain.on('notif-count', (event, count) => {
      log('on renderer notif-count', count);
      if (app.dock && app.dock.setBadge) {
        if (count) {
          app.dock.setBadge(count);
        } else {
          app.dock.setBadge('');
        }
      }
    });

    // Request to open an url
    ipcMain.on('open-url', (event, url, options) => {
      if (prefs.get('links-in-browser', true)) {
        log('on renderer open-url, externally', url);
        shell.openExternal(url);
      } else {
        log('on renderer open-url, new window', url);
        const newWindow = new BrowserWindow(options);
        newWindow.loadURL(url);
      }
    });
  }

  /**
   * Hide and destroy the tray menu.
   */
  destroyTrayMenu() {
    if (!this.tray) {
      return;
    }

    this.trayMenu = null;
    this.tray.destroy();
    this.tray = null;
  }

}

export default Application;
