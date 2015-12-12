import fs from 'fs';

/**
 * Reads the theme provided from src/themes/ and applies it to the page.
 */
window.applyTheme = function(themeFile) {
  fs.readFile('src/themes/' + themeFile + '.css', 'utf-8', function(err, cssFile) {
    if (err) {
      console.error(err);
    } else {
      pushTheme(cssFile);
    }
  });
};

/**
 * Appropriately applies the provided theme file code to the application.
 */
window.pushTheme = function(theme) {
  webView.executeJavaScript('document.getElementsByTagName("head")[0].appendChild(document.createElement("style"))');
  webView.executeJavaScript('document.getElementsByTagName("style")[0].innerHTML= "' + theme + '"');
};
