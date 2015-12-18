import remote from 'remote';

const webView = document.getElementById('webView');
const manifest = remote.getGlobal('manifest');

// Set the user agent and load the app
log('loading', manifest.wvUrl);
webView.setAttribute('useragent', navigator.userAgent);
webView.setAttribute('src', manifest.wvUrl);

export default webView;
