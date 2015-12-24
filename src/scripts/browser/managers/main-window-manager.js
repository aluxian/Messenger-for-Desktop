import filePaths from '../utils/filePaths';
import prefs from '../utils/prefs';
import {debounce} from 'lodash';
import shell from 'shell';

import BrowserWindow from 'browser-window';
import EventEmitter from 'events';

class MainWindowManager extends EventEmitter {

  static DEFAULT_BOUNDS = {
    width: 800,
    height: 600
  };

  constructor(manifest, options) {
    super();

    this.manifest = manifest;
    this.options = options;

    this.forceClose = false;
    this.startHidden = options.osStartup && prefs.get('startup-hidden', false);
  }

  createWindow() {
    log('creating main window');

    const bounds = prefs.get('window-bounds', MainWindowManager.DEFAULT_BOUNDS);
    const defaultOptions = {
      title: this.manifest.productName,
      backgroundColor: '#dfdfdf',
      useContentSize: true,
      minWidth: 355,
      minHeight: 355,
      show: false
    };

    const options = Object.assign(defaultOptions, bounds);
    this.window = new BrowserWindow(options);
  }

  initWindow() {
    // Replace the default user agent
    const cleanUA = this.getCleanUserAgent();
    this.window.webContents.setUserAgent(cleanUA);

    // Bind webContents events to local methods
    this.window.webContents.on('new-window', ::this.onNewWindow);
    this.window.webContents.on('dom-ready', ::this.onDomReady);

    // Bind events to local methods
    this.window.on('enter-full-screen', ::this.onEnterFullScreen);
    this.window.on('leave-full-screen', ::this.onLeaveFullScreen);
    this.window.on('closed', ::this.onClosed);
    this.window.on('close', ::this.onClose);
    this.window.on('focus', ::this.onFocus);

    // Save the bounds on resize or move
    const saveBounds = debounce(::this.saveBounds, 500);
    this.window.on('resize', saveBounds);
    this.window.on('move', saveBounds);

    // Restore full screen state
    const isFullScreen = prefs.get('full-screen', false);
    this.window.setFullScreen(isFullScreen);

    // Finally, load the app html
    this.window.loadURL(filePaths.getHtmlFile('app.html'));
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
    // Show the window
    log('onDomReady');
    if (!this.startHidden && !this.window.isVisible()) {
      this.window.show();
    }
  }

  /**
   * Called when the 'enter-full-screen' event is emitted.
   */
  onEnterFullScreen() {
    // Save in prefs
    prefs.set('full-screen', true);
  }

  /**
   * Called when the 'leave-full-screen' event is emitted.
   */
  onLeaveFullScreen() {
    // Save in prefs
    prefs.set('full-screen', false);
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
   * Called when the 'close' event is emitted.
   */
  onClose(event) {
    // Just hide the window, unless it's force closed
    log('onClose');
    if (!this.forceClose && process.platform == 'darwin') {
      event.preventDefault();
      this.window.hide();
    }
  }

  /**
   * Called when the 'focus' event is emitted.
   */
  onFocus() {
    // Also focus the webview
    log('onFocus');
    this.window.webContents.send('call-webview-method', 'focus');
  }

  /**
   * Called when the 'blur' event is emitted.
   */
  onBlur() {
    // Also blur the webview
    log('onBlur');
    this.window.webContents.send('call-webview-method', 'blur');
  }

  /**
   * Persist the current window's state.
   */
  saveBounds() {
    if (this.window.isFullScreen()) {
      return;
    }

    log('saving bounds');
    const bounds = this.window.getBounds();
    prefs.set('window-bounds', bounds);
  }

  /**
   * Remove identifiable information (e.g. app name) from the UA string.
   */
  getCleanUserAgent() {
    return this.window.webContents.getUserAgent()
      .replace(new RegExp(this.manifest.productName + '/[\\S]*', 'g'), '')
      .replace(new RegExp('Electron/[\\S]*', 'g'), '')
      .replace(/[ ]+/g, ' ');
  }

}

export default MainWindowManager;
