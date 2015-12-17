import electron from 'electron';
import spellChecker from 'spellchecker';
import debug from 'debug/browser';

(function() {
  const log = debug('whatsie:events-main');
  const ipcr = electron.ipcRenderer;

  const webFrame = electron.webFrame;
  const webView = document.getElementById('webView');

  // Set zoom level
  ipcr.on('zoom-level', function(event, zoomLevel) {
    webFrame.setZoomLevel(zoomLevel);
  });

  // Set spell chcker
  ipcr.on('spell-checker', function(event, enabled, autoCorrect) {
    if (enabled) {
      webFrame.setSpellCheckProvider('en-US', autoCorrect, {
        spellCheck: function(text) {
          return !spellChecker.isMisspelled(text);
        }
      });
    } else {
      webFrame.setSpellCheckProvider('en-US', autoCorrect, {
        spellCheck: function(text) {
          return true;
        }
      });
    }
  });
})();
