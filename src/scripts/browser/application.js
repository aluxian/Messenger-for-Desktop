import app from 'app';
import debug from 'debug';
import filer from './utils/filer';
import {ipcMain} from 'electron';

import AppMenu from './app-menu';
import AppWindow from './app-window';

import Menu from 'menu';
import EventEmitter from 'events';

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
    this.appMenu = new AppMenu();
    this.appMenu.setEventListeners();
    Menu.setApplicationMenu(this.appMenu.menu);
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
