import {ipcRenderer} from 'electron';

import webView from 'renderer/webview';
import files from 'common/utils/files';
import prefs from 'common/utils/prefs';

function createBadgeDataUrl(text) {
  const canvas = document.createElement('canvas');
  canvas.height = 140;
  canvas.width = 140;

  const context = canvas.getContext('2d');
  context.fillStyle = 'red';
  context.beginPath();
  context.ellipse(70, 70, 70, 70, 0, 0, 2 * Math.PI);
  context.fill();
  context.textAlign = 'center';
  context.fillStyle = 'white';

  if (text.length > 2) {
    context.font = 'bold 65px "Segoe UI", sans-serif';
    context.fillText('' + text, 70, 95);
  } else if (text.length > 1) {
    context.font = 'bold 85px "Segoe UI", sans-serif';
    context.fillText('' + text, 70, 100);
  } else {
    context.font = 'bold 100px "Segoe UI", sans-serif';
    context.fillText('' + text, 70, 105);
  }

  return canvas.toDataURL();
}

// Log console messages
webView.addEventListener('console-message', function(event) {
  const msg = event.message.replace(/%c/g, '');
  const fwNormal = 'font-weight: normal;';
  const fwBold = 'font-weight: bold;';
  console.log('%cWV:%c ' + msg, fwBold, fwNormal);
});

// Listen for title changes to update the badge
webView.addEventListener('page-title-updated', function() {
  const matches = /\(([\d]+)\)/.exec(webView.getTitle());
  const parsed = parseInt(matches && matches[1], 10);
  const count = isNaN(parsed) || !parsed ? '' : '' + parsed;
  let badgeDataUrl = null;

  if (process.platform == 'win32' && count) {
    badgeDataUrl = createBadgeDataUrl(count);
  }

  log('sending notif-count', count, !!badgeDataUrl || null);
  ipcRenderer.send('notif-count', count, badgeDataUrl);
});

// Handle url clicks
webView.addEventListener('new-window', function(event) {
  log('sending open-url', event.url);
  ipcRenderer.send('open-url', event.url, event.options);
});

// Listen for dom-ready
webView.addEventListener('dom-ready', function() {
  log('dom-ready');

  // Open dev tools when debugging
  const autoLaunchDevTools = window.localStorage.autoLaunchDevTools;
  if (autoLaunchDevTools && JSON.parse(autoLaunchDevTools)) {
    webView.openDevTools();
  }

  // Inject custom css
  log('injecting custom css');
  files.getStyleCss('mini')
    .then(css => webView.insertCSS(css))
    .catch(logError);

  // Restore the default theme
  const themeId = prefs.get('theme');
  if (themeId) {
    if (global.manifest.themes[themeId]) {
      log('restoring theme', themeId);
      files.getThemeCss(themeId)
        .then(css => webView.send('apply-theme', css))
        .catch(logError);
    } else {
      log('invalid theme, unsetting pref');
      prefs.unset('theme');
    }
  }

  // Restore the default zoom level
  const zoomLevel = prefs.get('zoom-level');
  if (zoomLevel) {
    log('restoring zoom level', zoomLevel);
    webView.send('zoom-level', zoomLevel);
  }

  // Restore spell checker and auto correct
  const spellCheckerCheck = prefs.get('spell-checker-check');
  if (spellCheckerCheck) {
    const autoCorrect = prefs.get('spell-checker-auto-correct');
    const langCode = prefs.get('spell-checker-language');
    log('restoring spell checker', spellCheckerCheck, 'auto correct', autoCorrect, 'lang code', langCode);
    webView.send('spell-checker', spellCheckerCheck, autoCorrect, langCode);
  }
});

// Listen for did-finish-load
webView.addEventListener('did-finish-load', function() {
  // Hide the loading splash screen
  const loadingSplashDiv = document.querySelector('.loader');
  loadingSplashDiv.style.opacity = 0;
  setTimeout(function() {
    loadingSplashDiv.style.display = 'none';
  }, 250);
});

// Animate the splash screen into view
document.addEventListener('DOMContentLoaded', function() {
  const loadingSplashDiv = document.querySelector('.loader');
  loadingSplashDiv.style.opacity = 1;
});

export default webView;
