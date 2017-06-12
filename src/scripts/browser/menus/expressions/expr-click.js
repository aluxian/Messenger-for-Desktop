import {app, shell, dialog} from 'electron';

import * as piwik from 'browser/services/piwik';
import filePaths from 'common/utils/file-paths';
import prefs from 'browser/utils/prefs';

/**
 * Call the handler for the check-for-update event.
 */
export function cfuCheckForUpdate (informUser) {
  return function () {
    global.application.autoUpdateManager.handleMenuCheckForUpdate(informUser);
  };
}

/**
 * Call the handler for the update-available event.
 */
export function cfuUpdateAvailable () {
  return function () {
    global.application.autoUpdateManager.handleMenuUpdateAvailable();
  };
}

/**
 * Call the handler for the update-downloaded event.
 */
export function cfuUpdateDownloaded () {
  return function () {
    global.application.autoUpdateManager.handleMenuUpdateDownloaded();
  };
}

/**
 * Reset the auto updater url (to use updated prefs).
 */
export function resetAutoUpdaterUrl () {
  return function () {
    global.application.autoUpdateManager.initFeedUrl();
  };
}

/**
 * Enable or disable automatic checks for update.
 */
export function checkForUpdateAuto (valueExpr) {
  return function () {
    const check = valueExpr.apply(this, arguments);
    global.application.autoUpdateManager.setAutoCheck(check);
  };
}

/**
 * Quit the app.
 */
export function appQuit () {
  return function () {
    app.quit();
  };
}

/**
 * Restart the app.
 */
export function restartApp () {
  return function () {
    app.relaunch();
    app.quit();
  };
}

/**
 * Show a mac-like About dialog.
 */
export function showCustomAboutDialog () {
  return function () {
    dialog.showMessageBox({
      icon: filePaths.getImagePath('app_icon.png'),
      title: 'About ' + global.manifest.productName,
      message: global.manifest.productName + ' v' + global.manifest.version + '-' + global.manifest.versionChannel,
      detail: global.manifest.copyright + '\n\n' + 'Special thanks to @sytten, @nevercast' +
        ', @TheHimanshu, @MichaelAquilina, @franciscoib, @levrik, and all the contributors on GitHub.'
    });
  };
}

/**
 * Send a message directly to the webview.
 */
export function sendToWebView (channel, ...valueExprs) {
  return function (menuItem, browserWindow) {
    if (!browserWindow) {
      browserWindow = global.application.mainWindowManager.window;
    }
    const values = valueExprs.map((e) => e.apply(this, arguments));
    browserWindow.webContents.send('fwd-webview', channel, ...values);
  };
}

/**
 * Send a message to the current BrowserWindow's WebContents.
 */
export function sendToWebContents (channel, ...valueExprs) {
  return function (menuItem, browserWindow) {
    if (!browserWindow) {
      browserWindow = global.application.mainWindowManager.window;
    }
    const values = valueExprs.map((e) => e.apply(this, arguments));
    browserWindow.webContents.send(channel, ...values);
  };
}

/**
 * Reload the browser window.
 */
export function reloadWindow () {
  return function (menuItem, browserWindow) {
    if (!browserWindow) {
      browserWindow = global.application.mainWindowManager.window;
    }
    browserWindow.webContents.reloadIgnoringCache();
  };
}

/**
 * Show (and focus) the window.
 */
export function showWindow () {
  return function (menuItem, browserWindow) {
    if (!browserWindow) {
      browserWindow = global.application.mainWindowManager.window;
    }
    if (browserWindow) {
      browserWindow.show();
    }
  };
}

/**
 * Toggle whether the window is in full screen or not.
 */
export function toggleFullScreen () {
  return function (menuItem, browserWindow) {
    if (!browserWindow) {
      browserWindow = global.application.mainWindowManager.window;
    }
    const newState = !browserWindow.isFullScreen();
    browserWindow.setFullScreen(newState);
  };
}

/**
 * Toggle the webview's dev tools panel.
 */
export function toggleWebViewDevTools () {
  return function (menuItem, browserWindow) {
    if (!browserWindow) {
      browserWindow = global.application.mainWindowManager.window;
    }
    browserWindow.webContents.send('toggle-wv-dev-tools');
  };
}

/**
 * Whether the menu bar should hide automatically.
 */
export function autoHideMenuBar (autoHideExpr) {
  return function (menuItem, browserWindow) {
    if (!browserWindow) {
      browserWindow = global.application.mainWindowManager.window;
    }
    const autoHide = autoHideExpr.apply(this, arguments);
    browserWindow.setAutoHideMenuBar(autoHide);
  };
}

/**
 * Show or hide the tray icon.
 */
export function showInTray (flagExpr) {
  return function () {
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
export function showInDock (flagExpr) {
  return function () {
    if (app.dock && app.dock.show && app.dock.hide) {
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
export function launchOnStartup (enabledExpr) {
  return function () {
    const enabled = enabledExpr.apply(this, arguments);
    if (enabled) {
      global.application.autoLauncher.enable()
        .then(() => log('auto launcher enabled'))
        .catch((err) => {
          log('could not enable auto-launcher');
          logError(err, true);
        });
    } else {
      global.application.autoLauncher.disable()
        .then(() => log('auto launcher disabled'))
        .catch((err) => {
          log('could not disable auto-launcher');
          logError(err, true);
        });
    }
  };
}

/**
 * If flag is false, the dock badge will be hidden.
 */
export function hideDockBadge (flagExpr) {
  return function () {
    const flag = flagExpr.apply(this, arguments);
    if (!flag) {
      app.setBadgeCount(0);
    }
  };
}

/**
 * If flag is false, the taskbar badge will be hidden.
 */
export function hideTaskbarBadge (flagExpr) {
  return function (menuItem, browserWindow) {
    if (!browserWindow) {
      browserWindow = global.application.mainWindowManager.window;
    }
    const flag = flagExpr.apply(this, arguments);
    if (!flag) {
      browserWindow.setOverlayIcon(null, '');
    }
  };
}

// Analytics
export const analytics = {

  /**
   * Track an event.
   */
  trackEvent: (...args) => {
    return function (menuItem, browserWindow) {
      const tracker = piwik.getTracker();
      if (tracker) {
        tracker.trackEvent(...args);
      }
    };
  }

};
