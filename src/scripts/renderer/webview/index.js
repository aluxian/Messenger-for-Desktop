const webView = document.getElementById('wv');

// Set the user agent and load the app
log('loading', global.manifest.wvUrl);
webView.setAttribute('useragent', navigator.userAgent);
webView.setAttribute('src', global.manifest.wvUrl);

export default webView;

require('./events');
require('./listeners');
