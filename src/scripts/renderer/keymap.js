import Mousetrap from 'mousetrap';
import webView from './webview';

log('binding keyboard shortcuts');

function bindSwitchConversation(keys, delta) {
  Mousetrap.bind(keys, function() {
    log('conversation', delta);
    webView.send('switch-conversation', delta);
    return false;
  });
}

// Previous chat
bindSwitchConversation(['mod+up', 'ctrl+shift+tab'], -1);

// Next chat
bindSwitchConversation(['mod+down', 'ctrl+tab'], +1);
