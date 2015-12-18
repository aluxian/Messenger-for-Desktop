import {ipcRenderer as ipcr} from 'electron';
import webView from './webview';

// Log console messages
webView.addEventListener('console-message', function(event) {
  const msg = event.message;
  const label = 'DEBUG: ';

  if (msg.indexOf(label) === 0) {
    log('WV', msg.replace(label, ''));
  } else {
    console.log('WV:', event.message);
  }
});

// Listen for title changes to update the badge
webView.addEventListener('page-title-updated', function(event) {
  const matches = /\((\d)\)/.exec(webView.getTitle());
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

export default webView;
