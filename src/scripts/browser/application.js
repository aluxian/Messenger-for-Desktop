import app from 'app';
import shell from 'shell';
import debug from 'debug';
import filer from './utils/filer';
import prefs from './utils/prefs';
import menuTemplate from './menus/template';
import {ipcMain} from 'electron';

import Menu from 'menu';
import EventEmitter from 'events';
import BrowserWindow from 'browser-window';
import AppWindow from './app-window';

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

}

export default Application;
