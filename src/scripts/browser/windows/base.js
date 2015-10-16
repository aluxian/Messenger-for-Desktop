import BrowserWindow from 'browser-window';
import EventEmitter from 'events';

class BaseWindow extends EventEmitter {

  /**
   * Create a browser window based off of some default settings.
   *
   * @param {Object} options
   */
  constructor(manifest, options) {
    super();

    this.manifest = manifest;
    this.window = new BrowserWindow(options);
  }

  /**
   * Load the target url inside the window.
   *
   * @param {String} targetUrl
   */
  loadUrl(targetUrl) {
    this.window.loadUrl(targetUrl);
  }

}

export default BaseWindow;
