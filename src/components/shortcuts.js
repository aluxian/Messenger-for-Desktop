/*
 * Slightly modified from Allen Guo's messenger-shortcuts; GPLv2 licensed
 * Source: https://github.com/guoguo12/messenger-shortcuts
 */

HELP_HTML = "List of shortcuts:\
<br><br>\
<b>Alt+Shift+C</b> &ndash; Compose new message<br>\
<b>Alt+Shift+Q</b> &ndash; Search for people and groups<br>\
<b>Alt+Shift+<i>n</i></b> &ndash; Jump to conversation <i>n</i>-th from top<br>\
<b>Alt+Shift+Up</b>/<b>Down</b> &ndash; Jump to conversation one above/below<br><br>\
<b>Alt+Shift+D</b> &ndash; Toggle conversation details<br>\
<b>Alt+Shift+M</b> &ndash; Mute conversation<br><br>\
<b>Alt+Shift+/</b> &ndash; Display this help dialog<br>\
"

/** Helper functions **/

function getByAttr(doc, tag, attr, value) {
  return doc.querySelector(tag + '[' + attr + '="' + value + '"]');
}

function last(arr) {
  return arr.length === 0 ? undefined : arr[arr.length - 1];
}


/** Functionality **/

function jumpToMessage(doc, index) {
  doc.querySelectorAll('div[aria-label="Conversations"] a')[index].click();
}

function verticalJump(doc, isUp) {
  console.log('hello');
  var conversations = doc.querySelectorAll('[aria-label="Conversation List"] li');
  console.log(conversations);
  for (var i = 0; i < conversations.length; i++) {
    console.log("jump "+i);
    if (conversations[i].getAttribute('aria-relevant')) {
      jumpToMessage(doc, i + (isUp ? -1 : 1));
      return;
    }
  }
}

function selectFirstSearchResult(doc) {
  var first = doc.querySelector('span[role="search"] a');
  if (first) {
    first.click();
    // focus message input afterwards in case the user already has that chat open
    focusMessageInput(doc);
  }
}

function compose(doc) {
  getByAttr(doc, 'a', 'title', 'New Message').click();
}

function toggleInfo(doc) {
  getByAttr(doc, 'a', 'title', 'Conversation Information').click();
}

function mute(doc) {
  getByAttr(doc, 'input', 'type', 'checkbox').click();
}

function getSearchBar(doc) {
  return getByAttr(doc, 'input', 'placeholder', 'Search for people and groups');
}

function focusSearchBar(doc) {
  getSearchBar(doc).focus();
}

function focusMessageInput(doc) {
  doc.querySelector('div[role="main"] div[role="textbox"]').click();
}

function openDeleteDialog(doc) {
  last(doc.querySelectorAll('div.contentAfter div[aria-label="Conversation actions"]')).click();
  doc.querySelector('a[role="menuitem"] span span').click();
}

function openHelp(doc) {
  mute(doc);
  setTimeout(function() {
    doc.querySelector('div[role="dialog"] h2').innerHTML = "Keyboard Shortcuts for Messenger";
    doc.querySelector('div[role="dialog"] h2~div').innerHTML = HELP_HTML;
    doc.querySelector('div[role="dialog"] h2~div~div').remove();
  }, 100);
}

module.exports = {
  inject: function(doc) {
    doc.body.onkeydown = function(event) {
      // Escape key
      if (event.keyCode === 27) {
        focusMessageInput(doc);
      }

      if (event.keyCode == 13 && doc.activeElement === getSearchBar(doc)) {
        // we're going to change the input, so throw away this keypress
        event.preventDefault();
        selectFirstSearchResult(doc);
        return;
      }

      // Only combinations of the form Alt+Shift+<key> are accepted
      if (!(event.altKey && event.shiftKey)) {
        return;
      }

      // Number keys
      if (event.keyCode >= 49 && event.keyCode <= 57) {
        jumpToMessage(doc, event.keyCode - 49);
      }

      // Other keys
      switch (event.keyCode) {
          case 67:  // C
              compose(doc);
          break;
          case 68:  // D
            toggleInfo(doc);
          break;
          case 77:  // M
              mute(doc);
          break;    
          case 81:  // Q
              focusSearchBar();
          break;    
          case 38: // up arrow
              verticalJump(doc, true);
          break;
          case 40: // down arrow
              verticalJump(doc, false);
          break;
          case 191: // Fwd. slash
              openHelp(doc);
          break;
          // default:
          //   focusMessageInput(doc);
      }
    }
  }
}
