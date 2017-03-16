import {ipcRenderer} from 'electron';

import * as piwik from 'renderer/services/piwik';
import webView from 'renderer/webview';

/**
 * Change the webview's zoom level.
 */
ipcRenderer.on('zoom-level', function (event, zoomLevel) {
  log('setting webview zoom level', zoomLevel);
  webView.setZoomLevel(zoomLevel);
});

/**
 * Forward a message to the webview.
 */
ipcRenderer.on('fwd-webview', function (event, channel, ...args) {
  if (typeof webView.isLoading === 'function' && !webView.isLoading()) {
    webView.send(channel, ...args);
  } else {
    const onLoaded = function () {
      webView.send(channel, ...args);
      webView.removeEventListener('dom-ready', onLoaded);
    };

    webView.addEventListener('dom-ready', onLoaded);
  }
});

/**
 * Call a method of the webview.
 */
ipcRenderer.on('call-webview-method', function (event, method, ...args) {
  if (typeof webView[method] === 'function') {
    webView[method](...args);
  } else {
    logError(new Error('method ' + method + ' on webview is not a function'));
  }
});

/**
 * Toggle the dev tools panel of the webview.
 */
ipcRenderer.on('toggle-wv-dev-tools', function (event) {
  if (webView.isDevToolsOpened()) {
    webView.closeDevTools();
  } else {
    webView.openDevTools();
  }
});

/**
 * Track an analytics event.
 */
ipcRenderer.on('track-analytics', function (event, name, args) {
  const tracker = piwik.getTracker();
  if (typeof tracker !== 'function') {
    const trackerFn = tracker[name];
    trackerFn(...args);
  } else {
    logError(new Error('piwik.getTracker is not a function'));
  }
});
