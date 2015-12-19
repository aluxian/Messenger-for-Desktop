import {ipcRenderer as ipcr} from 'electron';
import webView from './webview';

// Forward a message to the webview.
ipcr.on('fwd-webview', function(event, channel, ...args) {
  webView.send(channel, ...args);
});

/**
 * Call a method of the webview.
 */
ipcr.on('call-webview-method', function(event, method, ...args) {
  webView[method](...args);
});
