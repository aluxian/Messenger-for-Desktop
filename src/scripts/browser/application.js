import app from 'app';
import path from 'path';

import DefaultMenu from './menus/default';
import DefaultWindow from './windows/default';
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

    // Create and set the default menu
    this.menu = new DefaultMenu();
    this.menu.setEventListeners();
    this.menu.makeDefault();

    // Create and show the main window
    this.mainWindow = new DefaultWindow(manifest);
    this.mainWindow.loadUrl(`file://${path.resolve(__dirname, '..', '..', 'html', 'default.html')}`);
  }

  setEventListeners() {
    // Quit the app when all the windows are closed, except for darwin
    app.on('window-all-closed', function() {
      if (process.platform != 'darwin') {
        app.quit();
      }
    });
  }

}

export default Application;
