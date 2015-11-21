const remote = require('remote');
const manifest = remote.getGlobal('manifest');
const webView = document.getElementById('view');

// Set a custom UA and load the web app
webView.setAttribute('useragent', getCleanUserAgent());
webView.setAttribute('src', 'https://web.whatsapp.com/');
/**
 * Remove the app name and 'Electron' from the user agent.
 */
function getCleanUserAgent() {
  return navigator.userAgent
    .replace(new RegExp(manifest.productName + '/[\\S]*', 'g'), '')
    .replace(new RegExp('Electron/[\\S]*', 'g'), '')
    .replace(/[ ]+/g, ' ');
}

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

var fs = require('fs');
var themeList = fs.readdirSync('src/themes/');

var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

var menu = new Menu();


for (var i = 0; i < themeList.length; i++) {
  menu.append(new MenuItem({ label: themeList[i].replace(".css", ""), click: function(target) 
    { applyTheme(target.label); } }));
}

//menu.append(new MenuItem({ type: 'separator' }));
//menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }));


window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  menu.popup(remote.getCurrentWindow());
}, false);