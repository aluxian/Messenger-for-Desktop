import shell from 'shell';
import app from 'app';

import AppWindow from '../../app-window';

// TODO add comments

export function checkForUpdate() {
  return function() {
    // TODO
  };
}

export function appQuit() {
  return function() {
    app.exit(0);
  };
}

export function openUrl(url) {
  return function() {
    shell.openExternal(url);
  };
}

export function sendToWebContents(eventName, ...valueExprs) {
  return function(menuItem, browserWindow) {
    const values = valueExprs.map(e => e.apply(this, arguments));
    browserWindow.webContents.send(eventName, ...values);
  };
}

export function reloadWindow() {
  return function(menuItem, browserWindow) {
    browserWindow.reload();
  };
}

export function resetWindow() {
  return function(menuItem, browserWindow) {
    const bounds = AppWindow.DEFAULT_BOUNDS;
    browserWindow.setSize(bounds.width, bounds.height);
    browserWindow.center();
  };
}

export function toggleFullScreen() {
  return function(menuItem, browserWindow) {
    const newState = !browserWindow.isFullScreen();
    browserWindow.setFullScreen(newState);
  };
}

export function toggleDevTools() {
  return function(menuItem, browserWindow) {
    browserWindow.toggleDevTools();
  };
}

export function floatOnTop(flagExpr) {
  return function(menuItem, browserWindow) {
    const flag = flagExpr.apply(this, arguments);
    browserWindow.setAlwaysOnTop(flag);
  };
}

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
