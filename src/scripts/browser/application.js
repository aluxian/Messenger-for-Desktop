import app from 'app';
import filer from './tools/filer';
import debug from 'debug';
import {ipcMain} from 'electron';

import AppMenu from './menus/app';
import AppWindow from './windows/app';
import EventEmitter from 'events';

const log = debug('whatsie:Application');

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
    this.appMenu.makeDefault();
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