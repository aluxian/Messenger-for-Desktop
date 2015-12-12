import BrowserWindow from 'browser-window';
import EventEmitter from 'events';

class BaseWindow extends EventEmitter {

  /**
   * Create a browser window based on the given options.
   */
  constructor(manifest, options) {
    super();

    this.manifest = manifest;
    this.window = new BrowserWindow(options);
  }

  /**
   * Load the target url inside the window.
   */
  loadURL(targetUrl) {
    this.window.loadURL(targetUrl);
  }

}

export default BaseWindow;
