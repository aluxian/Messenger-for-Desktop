import {ipcRenderer as ipcr} from 'electron';
import Mousetrap from 'mousetrap';
import webView from './webview';
import remote from 'remote';

const prefs = remote.require('../browser/utils/prefs').default;

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

// Close with Esc
Mousetrap.bind('esc', function() {
  const enabled = prefs.get('close-with-esc');
  log('close with esc shortcut, enabled:', enabled);
  if (enabled) {
    ipcr.send('close-window');
  }
  return enabled;
});
