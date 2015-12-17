import app from 'app';
import debug from 'debug';
import filer from './utils/filer';
import {ipcMain} from 'electron';

import menuTemplate from './menus/template';
import AppWindow from './app-window';

import Menu from 'menu';
import EventEmitter from 'events';
import BrowserWindow from 'browser-window';

const log = debug('whatsie:application');

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

    this.setEventListeners();
    this.setIpcEventListeners();
  }

  /**
   * Create and set the default menu.
   */
  createAppMenu() {
    this.menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(this.menu);
  }

  /**
   * Create and show the main window.
   */
  createAppWindow() {
    this.mainWindow = new AppWindow(this.manifest);
    this.mainWindow.loadURL(filer.getHtmlFile('app.html'));
    this.mainWindow.on('closed', () => this.mainWindow = null);
  }

  /**
   * Listen to app events.
   */
  setEventListeners() {
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
    log('activate app, hasVisibleWindows =', hasVisibleWindows)
    if (!hasVisibleWindows) {
      if (this.mainWindow) {
        this.mainWindow.window.show();
      } else {
        this.createAppWindow();
      }
    }
  }

  /**
   * Listen for IPC events.
   */
  setIpcEventListeners() {
    // Guest app notifications count
    ipcMain.on('notif-count', (event, count) => {
      log('on notif-count', count);
      if (app.dock && app.dock.setBadge) {
        if (count) {
          app.dock.setBadge(count);
        } else {
          app.dock.setBadge('');
        }
      }
    });
  }

}

export default Application;
