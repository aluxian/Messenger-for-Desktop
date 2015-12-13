import app from 'app';
import shell from 'shell';
import debug from 'debug';
import fs from 'fs';

import {ipcMain} from 'electron';
import {isFunction} from 'lodash';
import prefs from '../utils/prefs';

import Menu from 'menu';
import AppWindow from './app-window';
import BrowserWindow from 'browser-window';
import EventEmitter from 'events';

const log = debug('whatsie:app-menu');

class AppMenu extends EventEmitter {

  /**
   * Build the menu based on a platform-specific template.
   */
  constructor() {
    super();
    const template = require(`../../menus/${process.platform}.js`).default;
    this.wireUpTemplate(template);
    this.menu = Menu.buildFromTemplate(template);
  }

  /**
   * Parse template items.
   */
  wireUpTemplate(submenu, parent) {
    const that = this;
    submenu.forEach(item => {
      item.parent = parent;
      const handlers = [];

      // Command handler
      if (item.command) {
        handlers.push(function() {
          log('menu item clicked', item.label, item.command);
          that.emit(item.command, item);
        });
      }

      // Restore checked state from prefs
      if (item.checked == 'pref') {
        item.checked = prefs.get(item.prefKey, 'default') === item[item.valueKey];
      }

      item.click = function() {
        handlers.forEach(handler => handler.call(item));
      };

      if (item.submenu) {
        that.wireUpTemplate(item.submenu, item);
      }
    });
  }

  /**
   * Set event listeners for menu commands.
   */
  setEventListeners() {
    this.setAppEventListeners();
    this.setWindowEventListeners();
  }

  setAppEventListeners() {
    this.on('application:quit', ::app.quit);

    this.on('application:show-settings', function() {
      // TODO
    });

    this.on('application:open-url', function(menuItem) {
      shell.openExternal(menuItem.url);
    });

    this.on('application:update-theme', function(menuItem) {
      focusedWindow().webContents.send('apply-theme', menuItem.theme);
      prefs.set('app:theme', menuItem.theme);
    });

    this.on('application:check-for-update', () => {
      // TODO
      // Updater.checkAndPrompt(this.manifest, true)
      //   .then(function(willUpdate) {
      //     if (willUpdate) {
      //       app.quit();
      //     }
      //   })
      //   .catch(::console.error);
    });
  }

  setWindowEventListeners() {
    this.on('window:reload', function() {
      focusedWindow().reload();
    });

    this.on('window:reset', function() {
      const bounds = AppWindow.DEFAULT_BOUNDS;
      const focusedWindow = focusedWindow();
      focusedWindow.setSize(bounds.width, bounds.height);
      focusedWindow.center();
      prefs.unset('window:bounds');
    });

    this.on('window:zoom-in', function() {
      const newLevel = prefs.get('window:zoom-level', 0) + 1;
      focusedWindow().webContents.send('zoom-level', newLevel);
      prefs.set('window:zoom-level', newLevel);
    });

    this.on('window:zoom-out', function() {
      const newLevel = prefs.get('window:zoom-level', 0) - 1;
      focusedWindow().webContents.send('zoom-level', newLevel);
      prefs.set('window:zoom-level', newLevel);
    });

    this.on('window:zoom-reset', function() {
      focusedWindow().webContents.send('zoom-level', 0);
      prefs.unset('window:zoom-level');
    });

    this.on('window:toggle-full-screen', function() {
      const focusedWindow = focusedWindow();
      const newState = !focusedWindow.isFullScreen();
      focusedWindow.setFullScreen(newState);
    });

    this.on('window:toggle-dev-tools', function() {
      focusedWindow().toggleDevTools();
    });
  }

}

function focusedWindow() {
  return BrowserWindow.getFocusedWindow();
}

export default AppMenu;
