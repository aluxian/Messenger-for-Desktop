import {webFrame, ipcRenderer, shell} from 'electron';
import {getDictionaryPath} from 'common/utils/spellchecker';
import SpellChecker from 'spellchecker';

// Set zoom level
ipcRenderer.on('zoom-level', function (event, zoomLevel) {
  log('zoom level', zoomLevel);
  webFrame.setZoomLevel(zoomLevel);
});

// Remove the top banner ad
ipcRenderer.on('remove-top-banner', function (event) {
  log('removing top banner ad');

  // Strip the HTML
  const bannerElems = document.getElementsByClassName('_s15');
  for (const bannerElem of bannerElems) {
    bannerElem.outerHTML = '';
  }

  // Fix non-automatic resize
  if (bannerElems.length) {
    webFrame.setZoomLevel(1);
    webFrame.setZoomLevel(0);
  }
});

// Show an 'app updated' notification
ipcRenderer.on('notify-app-updated', function (event) {
  log('notifying app updated');

  // Display the notification
  const notif = new window.Notification(global.manifest.productName, {
    body: 'App updated to v' + global.manifest.version + '. Click to see changes.',
    tag: 'notify-app-updated',
    canReply: false
  });
  notif.onclick = () => {
    setTimeout(() => {
      const changelogUrl = global.manifest.changelogUrl
        .replace(/%CURRENT_VERSION%/g, global.manifest.version);
      shell.openExternal(changelogUrl);
    }, 300);
  };
});

// Set spell checker
ipcRenderer.on('spell-checker', function (event, enabled, autoCorrect, langCode) {
  const chromiumLangCode = langCode.replace('_', '-');
  autoCorrect = !!autoCorrect;
  log('spell checker enabled:', enabled, 'auto correct:', autoCorrect, 'lang code:', langCode);

  if (enabled) {
    const dictionaryPath = getDictionaryPath(langCode);
    log('using', langCode, 'from', dictionaryPath || 'system', 'for spell checking');
    SpellChecker.setDictionary(langCode, dictionaryPath);
    webFrame.setSpellCheckProvider(chromiumLangCode, autoCorrect, {
      spellCheck: (text) => {
        return !SpellChecker.isMisspelled(text);
      }
    });
  } else {
    webFrame.setSpellCheckProvider(chromiumLangCode, autoCorrect, {
      spellCheck: () => {
        return true;
      }
    });
  }
});

// Insert the given theme css into the DOM
ipcRenderer.on('apply-theme', function (event, css) {
  let styleBlock = document.getElementById('cssTheme');

  if (!styleBlock) {
    styleBlock = document.createElement('style');
    styleBlock.id = 'cssTheme';
    styleBlock.type = 'text/css';
    document.head.appendChild(styleBlock);
  }

  styleBlock.innerHTML = css;
});

// Insert or remove the style required to auto-hide the sidebar
ipcRenderer.on('apply-sidebar-auto-hide', function (event, enabled, css) {
  let styleBlock = document.getElementById('sidebarAutoHide');

  if (enabled && !styleBlock) {
    styleBlock = document.createElement('style');
    styleBlock.id = 'sidebarAutoHide';
    styleBlock.type = 'text/css';
    styleBlock.innerHTML = css;
    document.head.appendChild(styleBlock);
  }

  if (!enabled && styleBlock) {
    styleBlock.parentNode.removeChild(styleBlock);
  }
});

// Add the selected misspelling to the dictionary
ipcRenderer.on('add-selection-to-dictionary', function () {
  SpellChecker.add(document.getSelection().toString());
});

// Simulate a click on the 'New chat' button
ipcRenderer.on('new-conversation', function () {
  const newChatButton = document.querySelector('._30yy[href="/new"]');
  if (newChatButton) {
    newChatButton.click();
  }
  const inputSearch = document.querySelector('[role="combobox"][tabindex="9998"]');
  if (inputSearch) {
    inputSearch.focus();
  }
});

// Focus the 'Search or start a new chat' input field
ipcRenderer.on('search-chats', function () {
  const inputSearch = document.querySelector('._58al');
  if (inputSearch) {
    inputSearch.focus();
  }
});

/**
 * Dispatch a click event on the given item.
 */
function dispatchClick (item) {
  // TODO broken
  item.dispatchEvent(new window.MouseEvent('mousedown', {
    view: window,
    bubbles: true,
    cancelable: false
  }));
}

// Switch to next/previous conversation
ipcRenderer.on('switch-conversation', function (event, indexDelta) {
  function getChatList () {
    const chatListElem = document.querySelectorAll('[aria-label~="Conversation"][aria-label~="list"] > li');
    if (chatListElem && chatListElem.length) {
      return Array.from(chatListElem).sort(function (a, b) {
        return parseInt(b.style.zIndex, 10) - parseInt(a.style.zIndex, 10);
      });
    }
  }

  function navigateConversation (delta) {
    const chatList = getChatList();
    if (!chatList) {
      return;
    }

    let found = false;
    for (let [i, item] of chatList.entries()) {
      const active = isItemActive(item);
      if (active) {
        const nextIndex = getDeltaIndex(i, delta, chatList);
        if (nextIndex !== -1) {
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

  function navigateConversationIndex (delta) {
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

  function getDeltaIndex (index, delta, chatList) {
    let deltaIndex = index + delta;
    if (deltaIndex < 0) {
      deltaIndex = -1;
    }
    if (deltaIndex >= chatList.length) {
      deltaIndex = -1;
    }
    return deltaIndex;
  }

  function isItemActive (item) {
    return item && !!item.getAttribute('aria-relevant');
  }

  // TODO broken
  function makeActive (item) {
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
