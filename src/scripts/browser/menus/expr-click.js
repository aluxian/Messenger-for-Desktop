import prefs from '../utils/prefs';
import shell from 'shell';
import app from 'app';

import AppWindow from '../app-window';

export function checkForUpdate() {
  return function(menuItem, browserWindow) {
    // TODO
  };
}

export function appExit(code = 0) {
  return function(menuItem, browserWindow) {
    app.exit(code);
  };
}

export function openUrl(url) {
  return function(menuItem, browserWindow) {
    shell.openExternal(url);
  };
}

export function sendToWebContents(eventName, valueExpr) {
  return function(menuItem, browserWindow) {
    browserWindow.webContents.send(eventName, valueExpr.apply(this, arguments));
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
