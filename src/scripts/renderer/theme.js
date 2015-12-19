import {ipcRenderer as ipcr} from 'electron';
import webView from './webview';
import fs from 'fs';

/**
 * Apply a CSS theme file to the app webview.
 */
ipcr.on('apply-theme', function(event, name) {
  if (!name) {
    return;
  }

  log('applying theme', name);
  fs.readFile('./src/themes/' + name + '.css', 'utf-8', function(err, css) {
    if (err) {
      return console.error(err);
    } else {
      webView.send('apply-theme', css);
    }
  });
});
