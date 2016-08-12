import {ipcRenderer} from 'electron';
import Mousetrap from 'mousetrap';

import prefs from 'common/utils/prefs';
import webView from 'renderer/webview';

log('binding keyboard shortcuts');

function bindSwitchConversation (keys, delta) {
  Mousetrap.bind(keys, function () {
    log('conversation', delta);
    webView.send('switch-conversation', delta);
    return false;
  });
}

// Previous chat
bindSwitchConversation(['ctrl+shift+tab'], -1);

// Next chat
bindSwitchConversation(['ctrl+tab'], +1);

// Close with Esc
Mousetrap.bind('esc', function () {
  const enabled = prefs.get('close-with-esc');
  log('close with esc shortcut, enabled:', enabled);
  if (enabled) {
    ipcRenderer.send('close-window');
  }
  return enabled;
});
