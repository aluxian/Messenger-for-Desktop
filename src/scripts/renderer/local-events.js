import electron from 'electron';
import debug from 'debug';

(function() {
  const NOTIF_COUNT_REGEX = /\((\d)\)/;

  const log = debug('whatsie:local-events');
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
})();
