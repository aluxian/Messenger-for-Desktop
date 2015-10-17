import app from 'app';
import filer from './tools/filer';

import AppMenu from './menus/app';
import AppWindow from './windows/app';
import EventEmitter from 'events';

class Application extends EventEmitter {

  /**
   * Load components and create the main window.
   *
   * @param {Object} manifest
   * @param {Object} options
   */
  constructor(manifest, options) {
    super();

    this.manifest = manifest;
    this.options = options;

    this.createAppMenu();
    this.createAppWindow();
    this.setEventListeners();
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
    this.appWindow.loadUrl(filer.getHtmlFile('app.html'));
  }

  /**
   * Listen to app events.
   */
  setEventListeners() {
    // Quit the app if all windows are closed
    app.on('window-all-closed', function() {
      app.quit();
    });
  }

}

export default Application;
