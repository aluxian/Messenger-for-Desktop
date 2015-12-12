import app from 'app';
import shell from 'shell';
import prefs from '../tools/prefs';
import debug from 'debug';
import fs from 'fs';

import BrowserWindow from 'browser-window';
import BaseMenu from './base';

const log = debug('whatsie:AppMenu');

class AppMenu extends BaseMenu {

  constructor() {
    const template = require(`../../../menus/${process.platform}.json`);
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

    this.on('application:send-email', function(menuItem) {
      log('application:send-email', menuItem.email);
      shell.openExternal('mailto:' + menuItem.email);
    });

    this.on('application:update-theme', function(menuItem) {
      log('application:update-theme', menuItem.theme);
      prefs.save('app:theme', menuItem.theme);

      const js = 'applyTheme("' + menuItem.theme + '");';
      BrowserWindow.getFocusedWindow().webContents.executeJavaScript(js);
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
      BrowserWindow.getFocusedWindow().reload();
    });

    this.on('window:reset', function() {
      log('window:reset');
      BrowserWindow.getFocusedWindow().setSize(800, 600);
      BrowserWindow.getFocusedWindow().center();
      prefs.delete('window:bounds');
    });

    this.on('window:toggle-full-screen', function() {
      log('window:toggle-full-screen');
      const focusedWindow = BrowserWindow.getFocusedWindow();
      focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
    });

    this.on('window:toggle-dev-tools', function() {
      log('window:toggle-dev-tools');
      BrowserWindow.getFocusedWindow().toggleDevTools();
    });
  }

}

export default AppMenu;
