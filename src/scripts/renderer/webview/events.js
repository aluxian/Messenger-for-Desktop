import {ipcRenderer} from 'electron';

import piwik from 'renderer/services/piwik';
import webView from 'renderer/webview';

/**
 * Forward a message to the webview.
 */
ipcRenderer.on('fwd-webview', function(event, channel, ...args) {
  if (webView.isLoading && (typeof webView.isLoading == 'function') && !webView.isLoading()) {
    webView.send(channel, ...args);
  } else {
    const onLoaded = function() {
      webView.send(channel, ...args);
      webView.removeEventListener('dom-ready', onLoaded);
    };

    webView.addEventListener('dom-ready', onLoaded);
  }
});

/**
 * Call a method of the webview.
 */
ipcRenderer.on('call-webview-method', function(event, method, ...args) {
  webView[method](...args);
});

/**
 * Track an analytics event.
 */
ipcRenderer.on('track-analytics', function(event, name, args) {
  const tracker = piwik.getTracker();
  if (tracker) {
    const trackerFn = tracker[name];
    trackerFn(...args);
  }
});
