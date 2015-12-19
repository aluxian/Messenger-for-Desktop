import {webFrame, ipcRenderer as ipcr} from 'electron';
import contextMenu from './preload-context-menu';
import spellChecker from 'spellchecker';
import remote from 'remote';

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

// Listen for context menu requests
window.addEventListener('contextmenu', function(event) {
  log('opening context menu');
  const menu = contextMenu.create(event);
  menu.popup(remote.getCurrentWindow());
});
