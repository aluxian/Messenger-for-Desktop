import {ipcRenderer as ipcr} from 'electron';
import analytics from './analytics';
import webView from './webview';

/**
 * Forward a message to the webview.
 */
ipcr.on('fwd-webview', function(event, channel, ...args) {
  if (!webView.isLoading()) {
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
ipcr.on('call-webview-method', function(event, method, ...args) {
  webView[method](...args);
});

/**
 * Track an analytics event.
 */
ipcr.on('track-analytics', function(event, name, args) {
  const tracker = analytics.getTracker();
  if (tracker) {
    const trackerFn = tracker[name];
    trackerFn(...args);
  }
});
