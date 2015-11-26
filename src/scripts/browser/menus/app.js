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
        var x = 'console.log("'+themeFile.theme+'")';
        BrowserWindow.getFocusedWindow().webContents.executeJavaScript(x);
        //BrowserWindow.getFocusedWindow().console.log("hello");//BrowserWindow.webContents.getURL();
      //var wv = document.getElementById('view');
      //wv.insertCSS("body { display:none; }");
      //file:"../../../themes/Fluttery.css";*/
      fs.readFile('src/themes/' + themeFile.theme + '.css', 'utf-8', function(err, cssFile) {
      if (err) {
        var e = 'console.log("'+err+'")';
        BrowserWindow.getFocusedWindow().webContents.executeJavaScript(e);
      } else {
        //  BrowserWindow.getFocusedWindow().webContents.executeJavaScript('var wView = document.getElementById("view");wView.executeJavaScript("console.log(document.getElementsByTagName(/"head/")[0])");');
          BrowserWindow.getFocusedWindow().webContents.executeJavaScript('wView.getElementsByTagName("head")[0].appendChild(wView.createElement("style"))');
  var applyTheme = 'wView.getElementsByTagName("style")[0].innerHTML= "'+ cssFile +'"';
  BrowserWindow.getFocusedWindow().webContents.executeJavaScript(applyTheme);
  console.log(applyTheme);
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
/**
 * Reads the theme provided from src/themes/ and applies it to the page.
 */
applyTheme(themeFile) {
  fs.readFile('src/themes/' + themeFile + '.css', 'utf-8', function(err, cssFile) {
      if (err) {
        console.error(err);
      } else {
        pushTheme(cssFile);
      }
  });
               /* webView.executeJavaScript(x);
                x = 'document.getElementsByTagName("style")[0].innerHTML= ".chat {background-color: #FFFACB;}"';
                webView.executeJavaScript(x);*/
}

/**
 * Appropriately applies the provided theme file code to the application.
 */
pushTheme(theme) {
  BrowserWindow.getFocusedWindow().webContents.executeJavaScript('var wView = document.getElementById("view");wView.getElementsByTagName("head")[0].appendChild(wView.createElement("style"))');
  var applyTheme = 'wView.getElementsByTagName("style")[0].innerHTML= "'+ theme +'"';
  BrowserWindow.getFocusedWindow().webContents.executeJavaScript(applyTheme);
  console.log(applyTheme);  
}
}

export default AppMenu;
