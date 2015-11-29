import app from 'app';
import shell from 'shell';
import fs from 'fs';

import BrowserWindow from 'browser-window';
import BaseMenu from './base';

class AppMenu extends BaseMenu {

  constructor() {
    const template = require(`../../../menus/${process.platform}.json`);
    super(template);
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

    });

    this.on('application:open-url', function(menuItem) {
      shell.openExternal(menuItem.url);
    });
    
    this.on('application:update-theme', function(themeFile) {
        fs.readFile('src/scripts/renderer/theme.js', 'utf-8', function(err, theme_js) {
            if (err) {
                var e = 'console.log("Error reading theme file '+err+'")';
                BrowserWindow.getFocusedWindow().webContents.executeJavaScript(e);
            }else {
                BrowserWindow.getFocusedWindow().webContents.executeJavaScript(theme_js+'applyTheme("'+themeFile.theme+'");');
            }
        });
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
      BrowserWindow.getFocusedWindow().reload();
    });

    this.on('window:toggle-dev-tools', function() {
      BrowserWindow.getFocusedWindow().toggleDevTools();
    });
  }
}

export default AppMenu;
