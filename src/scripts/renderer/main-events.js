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
})();
