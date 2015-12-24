import Mousetrap from 'mousetrap';
import webView from './webview';

log('binding keyboard shortcuts');

// Previous chat
Mousetrap.bind(['command+up', 'ctrl+up'], function() {
  log('previous conversation');
  webView.send('switch-conversation', -1);
  return false;
});

// Next chat
Mousetrap.bind(['command+down', 'ctrl+down'], function() {
  log('next conversation');
  webView.send('switch-conversation', +1);
  return false;
});
