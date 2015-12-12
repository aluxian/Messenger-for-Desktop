import debug from 'debug';

import BrowserWindow from 'browser-window';
import EventEmitter from 'events';

const log = debug('whatsie:BaseWindow');

class BaseWindow extends EventEmitter {

  /**
   * Create a browser window based on the given options.
   */
  constructor(manifest, options) {
    super();

    this.manifest = manifest;
    this.window = new BrowserWindow(options);

    const cleanUA = this.getCleanUserAgent();
    this.window.webContents.setUserAgent(cleanUA);

    this.window.on('closed', () => {
      this.window = null;
    });
  }

  /**
   * Load the target url inside the window.
   */
  loadURL(targetUrl) {
    this.window.loadURL(targetUrl);
  }

  /**
   * Remove identifiable information (e.g. app name) from the UA string.
   */
  getCleanUserAgent() {
    return this.window.webContents.getUserAgent()
      .replace(new RegExp(manifest.productName + '/[\\S]*', 'g'), '')
      .replace(new RegExp('Electron/[\\S]*', 'g'), '')
      .replace(/[ ]+/g, ' ');
  }

}

export default BaseWindow;
