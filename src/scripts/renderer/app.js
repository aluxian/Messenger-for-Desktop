import remote from 'remote';

const manifest = remote.getGlobal('manifest');
const appWebView = document.getElementById('appWebView');

// Set a custom UA and load the web app
appWebView.setAttribute('useragent', getCleanUserAgent());
appWebView.setAttribute('src', 'https://web.whatsapp.com/');

/**
 * Remove the app name and 'Electron' from the user agent.
 */
function getCleanUserAgent() {
  return navigator.userAgent
    .replace(new RegExp(manifest.productName + '/[\\S]*', 'g'), '')
    .replace(new RegExp('Electron/[\\S]*', 'g'), '')
    .replace(/[ ]+/g, ' ');
}
