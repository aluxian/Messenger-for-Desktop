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
