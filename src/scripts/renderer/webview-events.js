import {ipcRenderer as ipcr} from 'electron';
import webView from './webview';

// Set zoom level
ipcr.on('zoom-level', function(event, zoomLevel) {
  webView.send('zoom-level', zoomLevel);
});

// Set spell checker
ipcr.on('spell-checker', function(event, enabled, autoCorrect) {
  webView.send('spell-checker', enabled, autoCorrect);
});

/**
 * Call a method of the webview.
 */
ipcr.on('call-webview-method', function(event, method, ...args) {
  webView[method](...args);
});

/**
 * Add the selected misspelling to the dictionary.
 */
ipcr.on('add-selection-to-dictionary', function() {
  webView.send('add-selection-to-dictionary');
});
