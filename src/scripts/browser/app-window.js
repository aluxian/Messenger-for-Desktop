import lodash from 'lodash';

import BrowserWindow from 'browser-window';
import EventEmitter from 'events';

class AppWindow extends EventEmitter {

  /**
   * Create a browser window based off of some default settings.
   *
   * @param {Object} options
   * @return {AppWindow}
   */
  constructor(options) {
    super();

    const defaults = {
      width: 800,
      height: 600,
      'web-preferences': {
        'webaudio': true,
        'web-security': false,
        'use-content-size': true,
        'subpixel-font-scaling': true,
        'direct-write': true,
        'plugins': true
      }
    };

    this.settings = lodash.extend(defaults, options);
    this.window = this.createBrowserWindow(this.settings);
  }

  /**
   * Create a BrowserWindow with the given settings and handle some events.
   *
   * @param {Object} settings
   * @return {BrowserWindow}
   */
  createBrowserWindow(settings) {
    const browserWindow = new BrowserWindow(settings);

    browserWindow.on('closed', (e) => {
      this.emit('closed', e);
    });

    browserWindow.on('devtools-opened', () => {
      browserWindow.webContents.send('window:toggle-dev-tools', true);
    });

    browserWindow.on('devtools-closed', () => {
      browserWindow.webContents.send('window:toggle-dev-tools', false);
    });

    return browserWindow;
  }

  /**
   * Load the target url inside the window.
   *
   * @param {String} targetUrl
   */
  loadUrl(targetUrl) {
    this.window.loadUrl(targetUrl);
  }

  /**
   * Make the window visible and focus it.
   */
  show() {
    this.window.show();
  }

  /**
   * Close the window.
   */
  close() {
    this.window.close();
    this.window = null;
  }

}

export default AppWindow;
