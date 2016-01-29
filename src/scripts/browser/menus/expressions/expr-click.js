import prefs from '../../utils/prefs';
import shell from 'shell';
import app from 'app';

/**
 * Check for update.
 */
export function checkForUpdate() {
  return function() {
    global.application.autoUpdateManager.onClick();
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
 * Send a message directly to the webview.
 */
export function sendToWebView(channel, ...valueExprs) {
  return function(menuItem, browserWindow) {
    const values = valueExprs.map(e => e.apply(this, arguments));
    browserWindow.webContents.send('fwd-webview', channel, ...values);
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
    const bounds = prefs.getDefault('window-bounds');
    browserWindow.setSize(bounds.width, bounds.height, true);
    browserWindow.center();
  };
}

/**
 * Show (and focus) the window.
 */
export function showWindow() {
  return function(menuItem, browserWindow) {
    if (browserWindow) {
      browserWindow.show();
    } else {
      const windowManager = global.application.mainWindowManager;
      if (windowManager.window) {
        windowManager.window.show();
      }
    }
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
    const show = flagExpr.apply(this, arguments);
    if (show) {
      global.application.trayManager.create();
    } else {
      global.application.trayManager.destroy();
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

/**
 * Whether the app should launch automatically when the OS starts.
 */
export function launchOnStartup(enabledExpr, hiddenExpr) {
  return function() {
    const enabled = enabledExpr.apply(this, arguments);
    if (enabled) {
      const hidden = hiddenExpr.apply(this, arguments);
      global.application.autoLauncher.enable(hidden);
    } else {
      global.application.autoLauncher.disable();
    }
  };
}

/**
 * Whether the app should launch hidden when the OS starts.
 */
export function launchOnStartupHidden(hiddenExpr) {
  return function() {
    const hidden = hiddenExpr.apply(this, arguments);
    global.application.autoLauncher.enable(hidden);
  };
}

/**
 * If flag is true, the dock badge will be hidden.
 */
export function hideDockBadge(flagExpr) {
  return function() {
    const flag = flagExpr.apply(this, arguments);
    if (flag && app.dock && app.dock.setBadge) {
      app.dock.setBadge('');
    }
  };
}
