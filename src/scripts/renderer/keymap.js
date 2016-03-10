import Mousetrap from 'mousetrap';
import webView from './webview';

log('binding keyboard shortcuts');

// Previous chat
Mousetrap.bind(['mod+up', 'ctrl+shift+tab'], function() {
  log('previous conversation');
  webView.send('switch-conversation', -1);
  return false;
});

// Next chat
Mousetrap.bind(['mod+down', 'ctrl+tab'], function() {
  log('next conversation');
  webView.send('switch-conversation', +1);
  return false;
});
