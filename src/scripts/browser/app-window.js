import shell from 'shell';
import debug from 'debug';
import prefs from './utils/prefs';
import {debounce} from 'lodash';

import BrowserWindow from 'browser-window';
import EventEmitter from 'events';

const log = debug('whatsie:app-window');

class AppWindow extends EventEmitter {

  static DEFAULT_BOUNDS = {
    width: 800,
    height: 600
  };

  /**
   * Create a browser window based on the given options.
   */
  constructor(manifest, options) {
    super();
    this.manifest = manifest;
    this.createWindow();
    this.initWindow();
  }

  createWindow() {
    log('creating AppWindow');

    const bounds = prefs.get('window:bounds', AppWindow.DEFAULT_BOUNDS);
    const defaultOptions = {
      title: this.manifest.productName,
      backgroundColor: '#dfdfdf'
    };

    const options = Object.assign(defaultOptions, bounds);
    this.window = new BrowserWindow(options);
  }

  initWindow() {
    // Replace the default user agent
    const cleanUA = this.getCleanUserAgent();
    this.window.webContents.setUserAgent(cleanUA);

    // Bind events to local methods
    this.window.webContents.on('new-window', ::this.onNewWindow);
    this.window.webContents.on('dom-ready', ::this.onDomReady);
    this.window.on('closed', ::this.onClosed);
    this.window.on('close', ::this.onClose);

    // Save the bounds on resize or move
    const saveBounds = debounce(::this.saveBounds, 500);
    this.window.on('resize', saveBounds);
    this.window.on('move', saveBounds);
  }

  /**
   * Called when the 'new-window' event is emitted.
   */
  onNewWindow(event, url) {
    // Open urls in an external browser
    if (prefs.get('links-in-browser', true)) {
      log('opening url externally', url);
      event.preventDefault();
      shell.openExternal(url);
    } else {
      log('opening url in-app', url);
    }
  }

  /**
   * Called when the 'dom-ready' event is emitted.
   */
  onDomReady() {
    log('onDomReady');

    // Restore the default theme
    const theme = prefs.get('theme');
    if (theme) {
      log('restoring theme', theme);
      this.window.webContents.send('apply-theme', theme);
    }

    // Restore the default zoom level
    const zoomLevel = prefs.get('window:zoom-level');
    if (zoomLevel) {
      log('restoring zoom level', zoomLevel);
      this.window.webContents.send('zoom-level', zoomLevel);
    }

    // Restore spell checker
    const spellChecker = prefs.get('spell-checker');
    if (spellChecker) {
      log('restoring spell checker', spellChecker);
      this.window.webContents.send('spell-checker', spellChecker);
    }
  }

  /**
   * Called when the 'close' event is emitted.
   */
  onClose(event) {
    // Just hide the window
    log('onClose');
    if (process.platform == 'darwin') {
      event.preventDefault();
      this.window.hide();
    }
    // TODO only on X clicks, not app.quit or cmd+q
  }

  /**
   * Called when the 'closed' event is emitted.
   */
  onClosed() {
    // Remove the internal reference
    log('onClosed');
    this.window = null;
    this.emit('closed');
  }

  /**
   * Persist the current window's state.
   */
  saveBounds() {
    log('saving bounds');
    const bounds = this.window.getBounds();
    prefs.set('window:bounds', bounds);
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

export default AppWindow;
