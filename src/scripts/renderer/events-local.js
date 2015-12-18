import electron from 'electron';
import debug from 'debug/browser';

(function() {
  const NOTIF_COUNT_REGEX = /\((\d)\)/;

  const log = debug('whatsie:events-local');
  const logWV = debug('whatsie:webview');
  const ipcr = electron.ipcRenderer;

  const webView = document.getElementById('webView');

  // Listen for title changes to update the badge
  webView.addEventListener('page-title-updated', function(event) {
    const matches = NOTIF_COUNT_REGEX.exec(webView.getTitle());
    const parsed = parseInt(matches && matches[1], 10);
    const count = isNaN(parsed) || !parsed ? null : '' + parsed;
    log('sending notif-count', count);
    ipcr.send('notif-count', count);
  });

  // Handle url clicks
  webView.addEventListener('new-window', function(event) {
    log('sending open-url', event.url);
    ipcr.send('open-url', event.url, event.options);
  });

  // Log console messages
  webView.addEventListener('console-message', function(event) {
    logWV(event.message);
  });
})();
