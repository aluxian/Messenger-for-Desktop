import {app} from 'remote';
import path from 'path';

const webView = document.getElementById('wv');

// Set the user agent and load the app
log('loading', global.manifest.wvUrl);
webView.setAttribute('useragent', navigator.userAgent);
webView.setAttribute('src', global.manifest.wvUrl);

// Fix preload requiring file:// protocol
let preloadPath = webView.getAttribute('preload');
preloadPath = 'file://' + path.join(app.getAppPath(), 'html', preloadPath);
webView.setAttribute('preload', preloadPath);

export default webView;

require('renderer/webview/events');
require('renderer/webview/listeners');
