var fs = require('fs');

/**
 * Reads the theme provided from src/themes/ and applies it to the page.
 */
function applyTheme(themeFile) {
  fs.readFile('src/themes/' + themeFile + '.css', 'utf-8', function(err, cssFile) {
      if (err) {
        console.error(err);
      } else {
        pushTheme(cssFile);
      }
  });
               /* webView.executeJavaScript(x);
                x = 'document.getElementsByTagName("style")[0].innerHTML= ".chat {background-color: #FFFACB;}"';
                webView.executeJavaScript(x);*/
}

/**
 * Appropriately applies the provided theme file code to the application.
 */
function pushTheme(theme) {
  webView.executeJavaScript('document.getElementsByTagName("head")[0].appendChild(document.createElement("style"))');
  var applyTheme = 'document.getElementsByTagName("style")[0].innerHTML= "'+ theme +'"';
  webView.executeJavaScript(applyTheme);
  console.log(applyTheme);  
}


