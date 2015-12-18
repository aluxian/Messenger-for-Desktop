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
  fs.readFile('./src/themes/' + name + '.css', 'utf-8', function(err, cssFile) {
    if (err) {
      return console.error(err);
    }

    const css = cssFile
      .replace(/[\n\r]+/g, '') // replace new lines
      .replace(/"/g, '\\"'); // escape quotation marks

    webView.executeJavaScript(
      `
      var styleBlockId = "cssTheme";
      var styleBlock = document.getElementById(styleBlockId);

      if (!styleBlock) {
        styleBlock = document.createElement("style");
        styleBlock.id = styleBlockId;
        styleBlock.type = "text/css";
        document.head.appendChild(styleBlock);
      }

      styleBlock.innerHTML = "${css}";
      `
    );
  });
});
