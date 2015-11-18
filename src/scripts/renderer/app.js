const remote = require('remote');
const manifest = remote.getGlobal('manifest');
const webView = document.getElementById('view');
var fs = require('fs');
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
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

var menu = new Menu();
var x = 'document.getElementsByTagName("head")[0].appendChild(document.createElement("style"))';

var theme = "new";
menu.append(new MenuItem({ label: 'fluttery', click: function() 
    { 
        console.log(webView);
        
        fs.readFile('src/themes/' + theme + '.css', 'utf-8', function(err, css) {
            if (err) {
              console.error(err);
            } else {
                webView.executeJavaScript(x);
                x = 'document.getElementsByTagName("style")[0].innerHTML= "'+ css +'"';
                webView.executeJavaScript(x);
              console.log(css); 
            }
        });
               /* webView.executeJavaScript(x);
                x = 'document.getElementsByTagName("style")[0].innerHTML= ".chat {background-color: #FFFACB;}"';
                webView.executeJavaScript(x);*/
    }                   }));
menu.append(new MenuItem({ type: 'separator' }));
menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }));

window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  menu.popup(remote.getCurrentWindow());
}, false);