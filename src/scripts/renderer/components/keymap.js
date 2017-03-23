import {remote} from 'electron';
import Mousetrap from 'mousetrap';

import prefs from 'common/utils/prefs';
import webView from 'renderer/webview';

log('binding keyboard shortcuts');

function bindSwitchConversation (keys, direction) {
  Mousetrap.bind(keys, function () {
    log(direction, 'conversation');
    if (direction === 'next') {
      webView.send('switch-conversation-next');
    } else {
      webView.send('switch-conversation-previous');
    }
    return false;
  });
}

// Previous chat
bindSwitchConversation(['ctrl+shift+tab'], 'previous');

// Next chat
bindSwitchConversation(['ctrl+tab'], 'next');

// Close with Esc
Mousetrap.bind('esc', function () {
  const enabled = prefs.get('close-with-esc');
  log('close with esc shortcut, enabled:', enabled);
  if (enabled) {
    const mwm = remote.getGlobal('application').mainWindowManager;
    if (mwm) {
      mwm.window.close();
    }
  }
  return enabled;
});
