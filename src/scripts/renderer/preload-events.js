import {webFrame, ipcRenderer as ipcr} from 'electron';
import SpellChecker from 'spellchecker';
import remote from 'remote';

const {getDictionaryPath} = remote.require('../browser/utils/spellchecker');

// Set zoom level
ipcr.on('zoom-level', function(event, zoomLevel) {
  log('zoom level', zoomLevel);
  webFrame.setZoomLevel(zoomLevel);
});

// Set spell checker
ipcr.on('spell-checker', function(event, enabled, autoCorrect, langCode) {
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
ipcr.on('apply-theme', function(event, css) {
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
ipcr.on('add-selection-to-dictionary', function() {
  SpellChecker.add(document.getSelection().toString());
});

// Simulate a click on the 'New chat' button
ipcr.on('new-conversation', function() {
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
ipcr.on('search-chats', function() {
  const inputSearch = document.querySelector('input.input-search');
  if (inputSearch) {
    inputSearch.focus();
  }
});

// Switch to next/previous conversation
ipcr.on('switch-conversation', function(event, indexDelta) {
  function navigateConversation(delta) {
    const chatListElem = document.querySelectorAll('.infinite-list-item');
    if (!chatListElem || !chatListElem.length) {
      return;
    }

    let found = false;
    const chatList = Array.from(chatListElem).sort(function(a, b) {
      return parseInt(b.style.zIndex, 10) - parseInt(a.style.zIndex, 10);
    });

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
      log('make active', chat);
      chat.dispatchEvent(new MouseEvent('mousedown', {
        view: window,
        bubbles: true,
        cancelable: false
      }));
    }
  }

  navigateConversation(indexDelta);
});
