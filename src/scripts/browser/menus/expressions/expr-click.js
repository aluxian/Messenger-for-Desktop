import shell from 'shell';
import app from 'app';

import AppWindow from '../../app-window';

/**
 * Check for update.
 */
export function checkForUpdate() {
  return function() {
    // TODO
  };
}

/**
 * Quit the app.
 */
export function appQuit() {
  return function() {
    app.quit();
  };
}

/**
 * Open the url externally, in a browser.
 */
export function openUrl(url) {
  return function() {
    shell.openExternal(url);
  };
}

/**
 * Send a message to the browserWindow's webContents.
 */
export function sendToWebContents(channel, ...valueExprs) {
  return function(menuItem, browserWindow) {
    const values = valueExprs.map(e => e.apply(this, arguments));
    browserWindow.webContents.send(channel, ...values);
  };
}

/**
 * Reload the browser window.
 */
export function reloadWindow() {
  return function(menuItem, browserWindow) {
    browserWindow.reload();
  };
}

/**
 * Reset the window's position and size.
 */
export function resetWindow() {
  return function(menuItem, browserWindow) {
    const bounds = AppWindow.DEFAULT_BOUNDS;
    browserWindow.setSize(bounds.width, bounds.height);
    browserWindow.center();
  };
}

/**
 * Toggle whether the window is in full screen or not.
 */
export function toggleFullScreen() {
  return function(menuItem, browserWindow) {
    const newState = !browserWindow.isFullScreen();
    browserWindow.setFullScreen(newState);
  };
}

/**
 * Toggle the dev tools panel.
 */
export function toggleDevTools() {
  return function(menuItem, browserWindow) {
    browserWindow.toggleDevTools();
  };
}

/**
 * Whether the window should always appear on top.
 */
export function floatOnTop(flagExpr) {
  return function(menuItem, browserWindow) {
    const flag = flagExpr.apply(this, arguments);
    browserWindow.setAlwaysOnTop(flag);
  };
}

/**
 * Show or hide the tray icon.
 */
export function showInTray(flagExpr) {
  return function() {
    const app = global.application;
    if (app) {
      const show = flagExpr.apply(this, arguments);
      if (show) {
        app.createTrayMenu();
      } else {
        app.destroyTrayMenu();
      }
    }
  };
}

/**
 * Show or hide the dock icon.
 */
export function showInDock(flagExpr) {
  return function() {
    if (app.dock) {
      const show = flagExpr.apply(this, arguments);
      if (show) {
        app.dock.show();
      } else {
        app.dock.hide();
      }
    }
  };
}
