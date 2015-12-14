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
    this.appWindow = new AppWindow(this.manifest);
    this.appWindow.loadURL(filer.getHtmlFile('app.html'));
  }

  /**
   * Listen to app events.
   */
  setEventListeners() {
    // Quit the app if all windows are closed
    app.on('window-all-closed', function() {
      log('all windows closed, quitting');
      app.quit();
    });

    // Reopen the main window on dock clicks (OS X)
    app.on('activate', function(event, hasVisibleWindows) {
      log('activate app, hasVisibleWindows =', hasVisibleWindows)
      if (!hasVisibleWindows) {
        const mainWindow = AppWindow.MAIN_WINDOW();
        mainWindow.show();
      }
    });
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
