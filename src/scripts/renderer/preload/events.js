import {webFrame, ipcRenderer} from 'electron';
import {getDictionaryPath} from 'browser/utils/spellchecker';
import SpellChecker from 'spellchecker';

// Set zoom level
ipcRenderer.on('zoom-level', function(event, zoomLevel) {
  log('zoom level', zoomLevel);
  webFrame.setZoomLevel(zoomLevel);
});

// Set spell checker
ipcRenderer.on('spell-checker', function(event, enabled, autoCorrect, langCode) {
  const chromiumLangCode = langCode.replace('_', '-');
  autoCorrect = !!autoCorrect;
  log('spell checker enabled:', enabled, 'auto correct:', autoCorrect, 'lang code:', langCode);

  if (enabled) {
    SpellChecker.setDictionary(langCode, getDictionaryPath());
    webFrame.setSpellCheckProvider(chromiumLangCode, autoCorrect, {
      spellCheck: function(text) {
        return !SpellChecker.isMisspelled(text);
      }
    });
  } else {
    webFrame.setSpellCheckProvider(chromiumLangCode, autoCorrect, {
      spellCheck: function() {
        return true;
      }
    });
  }
});

// Insert the given theme css into the DOM
ipcRenderer.on('apply-theme', function(event, css) {
  let styleBlock = document.getElementById('cssTheme');

  if (!styleBlock) {
    styleBlock = document.createElement('style');
    styleBlock.id = 'cssTheme';
    styleBlock.type = 'text/css';
    document.head.appendChild(styleBlock);
  }

  styleBlock.innerHTML = css;
});

// Add the selected misspelling to the dictionary
ipcRenderer.on('add-selection-to-dictionary', function() {
  SpellChecker.add(document.getSelection().toString());
});

// Simulate a click on the 'New chat' button
ipcRenderer.on('new-conversation', function() {
  const newChatButton = document.querySelector('button.icon-chat');
  if (newChatButton) {
    newChatButton.click();
  }
  const inputSearch = document.querySelector('input.input-search');
  if (inputSearch) {
    inputSearch.focus();
  }
});

// Focus the 'Search or start a new chat' input field
ipcRenderer.on('search-chats', function() {
  const inputSearch = document.querySelector('input.input-search');
  if (inputSearch) {
    inputSearch.focus();
  }
});

/**
 * Dispatch a click event on the given item.
 */
function dispatchClick(item) {
  item.dispatchEvent(new MouseEvent('mousedown', {
    view: window,
    bubbles: true,
    cancelable: false
  }));
}

// // Open a dialog to pick a photo or a video to send
// ipcRenderer.on('send-photo-video', function() {
//   const attachButton = document.querySelector('.pane-chat-header button[title="Attach"]');
//   if (attachButton) {
//     attachButton.click();
//     setTimeout(function() {
//       const buttons = document.querySelectorAll('.pane-chat-header .menu-icons-item');
//       if (buttons[0]) {
//         dispatchClick(buttons[0]);
//       }
//     }, 300);
//   }
// });
//
// // Use the camera to take and send a photo
// ipcRenderer.on('take-photo', function() {
//   const attachButton = document.querySelector('.pane-chat-header button[title="Attach"]');
//   if (attachButton) {
//     attachButton.click();
//     setTimeout(function() {
//       const buttons = document.querySelectorAll('.pane-chat-header .menu-icons-item');
//       if (buttons[1]) {
//         dispatchClick(buttons[1]);
//       }
//     }, 300);
//   }
// });

// Switch to next/previous conversation
ipcRenderer.on('switch-conversation', function(event, indexDelta) {
  function getChatList() {
    const chatListElem = document.querySelectorAll('.infinite-list-item');
    if (chatListElem && chatListElem.length) {
      return Array.from(chatListElem).sort(function(a, b) {
        return parseInt(b.style.zIndex, 10) - parseInt(a.style.zIndex, 10);
      });
    }
  }

  function navigateConversation(delta) {
    const chatList = getChatList();
    if (!chatList) {
      return;
    }

    let found = false;
    for (let [i, item] of chatList.entries()) {
      const active = isItemActive(item);
      if (active) {
        const nextIndex = getDeltaIndex(i, delta, chatList);
        if (nextIndex != -1) {
          makeActive(chatList[nextIndex]);
        }
        found = true;
        break;
      }
    }

    if (!found) {
      if (delta > 0) {
        makeActive(chatList[0]);
      } else {
        makeActive(chatList[chatList.length - 1]);
      }
    }
  }

  function navigateConversationIndex(delta) {
    const chatList = getChatList();
    if (!chatList) {
      return;
    }

    if (delta < 0) {
      delta = 0;
    }

    if (delta >= chatList.length) {
      delta = chatList.length - 1;
    }

    makeActive(chatList[delta]);
  }

  function getDeltaIndex(index, delta, chatList) {
    let deltaIndex = index + delta;
    if (deltaIndex < 0) {
      deltaIndex = -1;
    }
    if (deltaIndex >= chatList.length) {
      deltaIndex = -1;
    }
    return deltaIndex;
  }

  function isItemActive(item) {
    const chat = item.querySelector('.chat');
    return chat && chat.classList.contains('active');
  }

  function makeActive(item) {
    const chat = item.querySelector('.chat');
    if (chat) {
      dispatchClick(chat);
    }
  }

  if (indexDelta > 1000) {
    navigateConversationIndex(indexDelta - 1000 - 1);
  } else {
    navigateConversation(indexDelta);
  }
});
