import {webFrame, ipcRenderer as ipcr} from 'electron';
import spellChecker from 'spellchecker';

/**
 * Custom logger. The implicit one doesn't work in preload.
 */
const log = function(...messages) {
  console.log('DEBUG: ' + messages.join(' '));
};

// Set zoom level
ipcr.on('zoom-level', function(event, zoomLevel) {
  log('zoom level', zoomLevel);
  webFrame.setZoomLevel(zoomLevel);
});

// Set spell checker
ipcr.on('spell-checker', function(event, enabled, autoCorrect) {
  autoCorrect = !!autoCorrect;
  log('spell checker enabled:', enabled, 'auto correct:', autoCorrect);
  if (enabled) {
    webFrame.setSpellCheckProvider('en-US', autoCorrect, {
      spellCheck: function(text) {
        return !spellChecker.isMisspelled(text);
      }
    });
  } else {
    webFrame.setSpellCheckProvider('en-US', autoCorrect, {
      spellCheck: function() {
        return true;
      }
    });
  }
});

// Forward context menu opens
document.addEventListener('contextmenu', function(event) {
  log('seding context-menu');
  ipcr.send('context-menu', {
    hasSelection: !!document.getSelection().toString(),
    targetIsEditable: event.target.isContentEditable,
    targetIsLink: event.target.tagName == 'A',
    href: event.target.href
  });
  event.preventDefault();
}, false);
