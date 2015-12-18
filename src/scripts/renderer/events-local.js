import {ipcRenderer as ipcr} from 'electron';

const notifCountRegex = /\((\d)\)/;
const webView = document.getElementById('webView');

// Listen for title changes to update the badge
webView.addEventListener('page-title-updated', function(event) {
  const matches = notifCountRegex.exec(webView.getTitle());
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
