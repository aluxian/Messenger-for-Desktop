import electron from 'electron';
import debug from 'debug';
import fs from 'fs';

(function() {
  const webView = document.getElementById('webView');
  const log = debug('whatsie:theme');
  const ipcr = electron.ipcRenderer;

  /**
   * Apply a CSS theme file to the app webview.
   */
  ipcr.on('apply-theme', function(event, name) {
    if (!name || name == 'default') {
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
})();
