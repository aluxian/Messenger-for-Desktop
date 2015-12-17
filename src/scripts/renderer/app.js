import debug from 'debug/browser';

(function() {
  const log = debug('whatsie:app');

  // Set the user agent and load the app
  const webView = document.getElementById('webView');
  webView.setAttribute('useragent', navigator.userAgent);
  webView.setAttribute('src', 'https://web.whatsapp.com/');
})();
