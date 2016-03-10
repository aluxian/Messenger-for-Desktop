import {ipcRenderer as ipcr} from 'electron';
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
