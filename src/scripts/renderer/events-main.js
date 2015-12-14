import electron from 'electron';
import debug from 'debug';

(function() {
  const log = debug('whatsie:main-events');
  const ipcr = electron.ipcRenderer;

  const webFrame = electron.webFrame;
  const webView = document.getElementById('webView');

  // Set zoom level
  ipcr.on('zoom-level', function(event, zoomLevel) {
    webFrame.setZoomLevel(zoomLevel);
  });

  // Set spell chcker
  // ipcr.on('spell-checker', function(event, enabled) {
  //   if (enabled) {
  //     webFrame.setSpellCheckProvider('en-US', true, {
  //       spellCheck: function(text) {
  //         return !(require('spellchecker').isMisspelled(text));
  //       }
  //     });
  //   } else {
  //
  //   }
  // });
})();
