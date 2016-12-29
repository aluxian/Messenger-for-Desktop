import {shell, BrowserWindow, Menu} from 'electron';
import debounce from 'lodash.debounce';
import EventEmitter from 'events';

import filePaths from 'common/utils/file-paths';
import platform from 'common/utils/platform';
import contextMenu from 'browser/menus/context';
import prefs from 'browser/utils/prefs';

class MainWindowManager extends EventEmitter {

  constructor () {
    super();
    this.forceClose = false;
    this.updateInProgress = false;
    this.startHidden = global.options.osStartup && prefs.get('launch-startup-hidden');
    this.initialTitle = global.manifest.productName;
  }

  setTrayManager (trayManager) {
    this.trayManager = trayManager;
  }

  setMenuManager (menuManager) {
    this.menuManager = menuManager;
  }

  createWindow () {
    log('creating main window');

    let bounds = prefs.get('window-bounds');
    if (!this.windowBoundsAreValid(bounds)) {
      log('invalid window bounds, using default', bounds);
      bounds = prefs.getDefault('window-bounds');
      prefs.unset('window-bounds');
    }

    const defaultOptions = {
      title: this.initialTitle,
      backgroundColor: '#ffffff',
      useContentSize: true,
      minWidth: 458,
      minHeight: 355,
      show: false
    };

    // Fix Window icon on Linux
    if (platform.isLinux) {
      defaultOptions.icon = filePaths.getImagePath('windowIcon.png');
    }

    const options = Object.assign(defaultOptions, bounds);
    this.window = new BrowserWindow(options);
  }

  initWindow () {
    // Replace the default user agent
    const cleanUA = this.getCleanUserAgent();
    this.window.webContents.setUserAgent(cleanUA);

    // Bind webContents events to local methods
    this.window.webContents.on('new-window', ::this.onNewWindow);
    this.window.webContents.on('will-navigate', ::this.onWillNavigate);
    this.window.webContents.on('context-menu', ::this.onContextMenu);

    // Bind events to local methods
    this.window.on('ready-to-show', ::this.onReadyToShow);
    this.window.on('enter-full-screen', ::this.onEnterFullScreen);
    this.window.on('leave-full-screen', ::this.onLeaveFullScreen);
    this.window.on('closed', ::this.onClosed);
    this.window.on('close', ::this.onClose);
    this.window.on('focus', ::this.onFocus);
    this.window.on('blur', ::this.onBlur);
    this.window.on('show', ::this.onShow);
    this.window.on('hide', ::this.onHide);

    // Save the bounds on resize or move
    const saveBounds = debounce(::this.saveBounds, 500);
    this.window.on('resize', saveBounds);
    this.window.on('move', saveBounds);

    // Restore full screen state
    const isFullScreen = prefs.get('window-full-screen');
    this.window.setFullScreen(isFullScreen);

    // Finally, load the app html
    this.window.loadURL(global.manifest.virtualUrl + '/html/app.html');
  }

  /**
   * Validate the window bounds by making sure they're not off-screen.
   */
  windowBoundsAreValid (bounds) {
    return bounds.x !== -32000 && bounds.y !== -32000;
  }

  /**
   * Called when the 'new-window' event is emitted.
   */
  onNewWindow (event, url) {
    // Open urls in an external browser
    if (prefs.get('links-in-browser')) {
      log('opening url externally', url);
      event.preventDefault();
      shell.openExternal(url);
    } else {
      log('opening url in-app', url);
    }
  }

  /**
   * Called when the 'will-navigate' event is emitted.
   */
  onWillNavigate (event, url) {
    if (global.manifest.dev) {
      log('navigation not prevented (dev mode)', url);
    } else {
      // Don't navigate away
      event.preventDefault();
      log('navigation prevented', url);
    }
  }

  /**
   * Called when the 'context-menu' event is received.
   * TODO: Facebook intercepts this so it doesn't work, but at least it won't crash
   */
  onContextMenu (event, params) {
    log('on context-menu');
    try {
      const menu = contextMenu.create(params, this.window);
      if (menu) {
        log('opening context menu');
        setTimeout(() => {
          menu.popup(this.window);
        }, 50);
      }
    } catch (err) {
      logError(err);
    }
  }

  /**
   * Called when the 'ready-to-show' event is emitted.
   */
  onReadyToShow () {
    // Show the window
    log('ready-to-show');
    if (!this.startHidden && !this.window.isVisible()) {
      this.window.show();
    }
  }

  /**
   * Called when the 'enter-full-screen' event is emitted.
   */
  onEnterFullScreen () {
    if (platform.isLinux) {
      return; // this event isn't triggered correctly on linux
    }
    // Save in prefs
    prefs.set('window-full-screen', true);
  }

  /**
   * Called when the 'leave-full-screen' event is emitted.
   */
  onLeaveFullScreen () {
    if (platform.isLinux) {
      return; // this event isn't triggered correctly on linux
    }
    // Save in prefs
    prefs.set('window-full-screen', false);
  }

  /**
   * Called when the 'closed' event is emitted.
   * Remove the internal reference to the window.
   */
  onClosed () {
    log('onClosed');
    this.window = null;
    this.emit('closed');
  }

  /**
   * Called when the 'close' event is emitted.
   */
  onClose (event) {
    log('onClose', 'forceClose=' + this.forceClose);

    // The app is being updated, don't prevent closing
    if (this.updateInProgress) {
      return;
    }

    // Just hide the window on Darwin
    if (!this.forceClose && platform.isDarwin) {
      event.preventDefault();
      this.hideWindow();
    }

    // Just hide the window if it's already running in the tray
    if (!this.forceClose && prefs.get('show-tray')) {
      event.preventDefault();
      this.hideWindow();

      // Inform the user the app is still running
      if (platform.isWindows && !prefs.get('quit-behaviour-taught')) {
        const tray = this.trayManager.tray;
        if (tray) {
          tray.displayBalloon({
            title: global.manifest.productName,
            content: global.manifest.productName + ' will keep running in the tray until you quit it.'
          });
          prefs.set('quit-behaviour-taught', true);
        }
      }
    }
  }

  /**
   * Called when the 'focus' event is emitted.
   */
  onFocus () {
    log('onFocus');

    // Forward this event to the webview
    this.window.webContents.send('call-webview-method', 'focus');

    // Validate window bounds
    let bounds = this.window.getBounds();
    if (!this.windowBoundsAreValid(bounds)) {
      log('invalid window bounds, restoring to default', bounds);
      prefs.unset('window-bounds');
      bounds = prefs.getDefault('window-bounds');
      this.window.setSize(bounds.width, bounds.height, true);
      this.window.center();
    }
  }

  /**
   * Called when the 'blur' event is emitted.
   */
  onBlur () {
    log('onBlur');

    // Forward this event to the webview
    this.window.webContents.send('call-webview-method', 'blur');
  }

  /**
   * Called when the 'show' event is emitted.
   */
  onShow () {
    log('onShow');
    // Enable window specific menu items
    if (this.menuManager) {
      this.menuManager.windowSpecificItemsEnabled(true);
    }
  }

  /**
   * Called when the 'hide' event is emitted.
   */
  onHide () {
    log('onHide');
    // Disable window specific menu items
    if (this.menuManager) {
      this.menuManager.windowSpecificItemsEnabled(false);
    }
  }

  /**
   * Persist the current window's state.
   */
  saveBounds () {
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
  getCleanUserAgent () {
    return this.window.webContents.getUserAgent()
      .replace(new RegExp(global.manifest.productName + '/[\\S]*', 'g'), '')
      .replace(new RegExp('Electron/[\\S]*', 'g'), '')
      .replace(new RegExp('\\s+', 'g'), ' ');
  }

  /**
   * Show and focus or create the main window.
   */
  showOrCreate () {
    if (this.window) {
      this.window.show();
    } else {
      this.createWindow();
      this.initWindow();
    }
  }

  /**
   * Append a suffix to the window title.
   */
  suffixWindowTitle (suffix) {
    if (this.window) {
      this.window.setTitle(this.initialTitle + suffix);
    }
  }

  /**
   * Hide the whole app on OS X, not just the window.
   */
  hideWindow () {
    if (platform.isDarwin) {
      Menu.sendActionToFirstResponder('hide:');
    } else {
      this.window.hide();
    }
  }

}

export default MainWindowManager;
