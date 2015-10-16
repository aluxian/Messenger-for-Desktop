import BrowserWindow from 'browser-window';
import EventEmitter from 'events';

class BaseWindow extends EventEmitter {

  /**
   * Create a browser window based off of some default settings.
   *
   * @param {Object} options
   */
  constructor(options) {
    super();

    const defaults = {
      width: 800,
      height: 640
    };

    const settings = Object.assign(defaults, options);
    this.window = this.createBrowserWindow(settings);
  }

  /**
   * Create a BrowserWindow with the given settings.
   *
   * @param {Object} settings
   * @return {BrowserWindow}
   */
  createBrowserWindow(settings) {
    return new BrowserWindow(settings);
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

export default BaseWindow;
