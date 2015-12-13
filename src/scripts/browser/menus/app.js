import app from 'app';
import shell from 'shell';
import prefs from '../tools/prefs';
import {ipcMain} from 'electron';
import debug from 'debug';
import fs from 'fs';

import BrowserWindow from 'browser-window';
import BaseMenu from './base';

const log = debug('whatsie:AppMenu');

class AppMenu extends BaseMenu {

  constructor() {
    const template = require(`../../menus/${process.platform}.js`).default;
    super(template);
  }

  init(template) {
    this.restoreTheme(template);
    super.init(template);
  }

  /**
   * Set the current theme as active in the menu.
   */
  restoreTheme(template) {
    const themeName = prefs.get('app:theme', 'default');
    const themeMenu = template.find(item => item.label === 'Theme');
    themeMenu.submenu.find(item => item.theme === themeName).checked = true;
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
      log('application:show-settings');
    });

    this.on('application:open-url', function(menuItem) {
      log('application:open-url', menuItem.url);
      shell.openExternal(menuItem.url);
    });

    this.on('application:update-theme', function(menuItem) {
      log('application:update-theme', menuItem.theme);
      prefs.set('app:theme', menuItem.theme);
      focusedWindow().webContents.send('apply-theme', menuItem.theme);
    });

    this.on('application:check-for-update', () => {
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
      log('window:reload');
      focusedWindow().reload();
    });

    this.on('window:reset', function() {
      log('window:reset');
      focusedWindow().setSize(800, 600);
      focusedWindow().center();
      prefs.unset('window:bounds');
    });

    this.on('window:zoom-in', function() {
      log('window:zoom-in');
      const newLevel = prefs.get('window:zoom-level', 0) + 1;
      focusedWindow().webContents.send('zoom-level', newLevel);
      prefs.set('window:zoom-level', newLevel);
    });

    this.on('window:zoom-out', function() {
      log('window:zoom-out');
      const newLevel = prefs.get('window:zoom-level', 0) - 1;
      focusedWindow().webContents.send('zoom-level', newLevel);
      prefs.set('window:zoom-level', newLevel);
    });

    this.on('window:zoom-reset', function() {
      log('window:zoom-reset');
      focusedWindow().webContents.send('zoom-level', 0);
      prefs.unset('window:zoom-level');
    });

    this.on('window:toggle-full-screen', function() {
      log('window:toggle-full-screen');
      const focusedWindow = focusedWindow();
      const newState = !focusedWindow.isFullScreen();
      focusedWindow.setFullScreen(newState);
    });

    this.on('window:toggle-dev-tools', function() {
      log('window:toggle-dev-tools');
      focusedWindow().toggleDevTools();
    });
  }

}

function focusedWindow() {
  return BrowserWindow.getFocusedWindow();
}

export default AppMenu;
