import fs from 'fs';

/**
 * Apply a CSS theme file to the app webview.
 */
function applyTheme(name) {
  fs.readFile('./src/themes/' + name + '.css', 'utf-8', function(err, cssFile) {
    if (err) {
      return console.error(err);
    }

    const cleanedCss = cssFile
      .replace(/"/g, '\\"');

    appWebView.executeJavaScript(
      `
      var styleBlockId = "cssTheme";
      var styleBlock = document.getElementById(styleBlockId);

      if (!styleBlock) {
        styleBlock = document.createElement("style");
        styleBlock.id = styleBlockId;

        var head = document.getElementsByTagName("head")[0];
        head.appendChild(styleBlock);
      }

      styleBlock.innerHTML= "${cleanedCss}";
      `
    );
  });
}
