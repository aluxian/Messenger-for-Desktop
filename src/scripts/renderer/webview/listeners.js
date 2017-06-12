import {shell, remote} from 'electron';

import webView from 'renderer/webview';
import files from 'common/utils/files';
import prefs from 'common/utils/prefs';
import urls from 'common/utils/urls';

function createBadgeDataUrl (text) {
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
webView.addEventListener('console-message', function (event) {
  const msg = event.message.replace(/%c/g, '');
  console.log('WV: ' + msg);
  log('WV:', msg);
});

// Listen for title changes to update the badge
let _delayedRemoveBadge = null;
webView.addEventListener('page-title-updated', function () {
  log('webview page-title-updated');
  const matches = /\(([\d]+)\)/.exec(webView.getTitle());
  const parsed = parseInt(matches && matches[1], 10);
  const count = isNaN(parsed) || !parsed ? '' : '' + parsed;
  let badgeDataUrl = null;

  if (process.platform === 'win32' && count) {
    badgeDataUrl = createBadgeDataUrl(count);
  }

  log('notifying window of notif-count', count, !!badgeDataUrl || null);
  clearTimeout(_delayedRemoveBadge);

  // clear badge either instantly or after delay
  _delayedRemoveBadge = setTimeout(() => {
    const mwm = remote.getGlobal('application').mainWindowManager;
    if (mwm && typeof mwm.notifCountChanged === 'function') {
      mwm.notifCountChanged(count, badgeDataUrl);
    }
  }, count ? 0 : 1500);
});

// Handle url clicks
webView.addEventListener('new-window', function (event) {
  log('webview new-window', JSON.stringify(event));
  const url = urls.skipFacebookRedirect(event.url);
  event.preventDefault();

  // download url
  if (urls.isDownloadUrl(url)) {
    log('on webview new-window, downloading', url);
    webView.getWebContents().loadURL(url);
    return;
  }

  // open it externally (if preference is set)
  if (prefs.get('links-in-browser')) {
    log('on webview new-window, externally', url);
    shell.openExternal(url);
    return;
  }

  // otherwise open it in a new app window (unless it's an audio/video call)
  if (event.frameName !== 'Video Call' || event.url !== 'about:blank') {
    const options = Object.assign({
      title: event.frameName || global.manifest.productName,
      darkTheme: global.manifest.darkThemes.includes(prefs.get('theme'))
    }, event.options || {});
    log('on webview new-window, new window', url, options);
    const newWindow = new remote.BrowserWindow(options);
    newWindow.loadURL(url);
    event.newGuest = newWindow;
  }
});

// Listen for dom-ready
webView.addEventListener('dom-ready', function () {
  log('webview dom-ready');

  // Open dev tools when debugging
  const autoLaunchDevTools = window.localStorage.autoLaunchDevTools;
  if (autoLaunchDevTools && JSON.parse(autoLaunchDevTools)) {
    webView.openDevTools();
  }

  // Restore the default theme
  const themeId = prefs.get('theme');
  if (themeId) {
    if (global.manifest.themes[themeId]) {
      log('restoring theme', themeId);
      files.getThemeCss(themeId)
        .then((css) => webView.send('apply-theme', css))
        .catch(logError);
    } else {
      log('invalid theme, unsetting pref');
      prefs.unset('theme');
    }
  }

  // Load webview style overrides
  log('restoring webview css override', themeId);
  files.getStyleCss('webview')
    .then((css) => webView.send('apply-webview-css', css))
    .catch(logError);

  // Restore the sidebar auto-hide setting
  const sidebarAutoHide = prefs.get('sidebar-auto-hide');
  if (sidebarAutoHide) {
    log('restoring sidebar auto-hide', sidebarAutoHide);
    files.getStyleCss('sidebar-auto-hide')
      .then((css) => webView.send('apply-sidebar-auto-hide', sidebarAutoHide, css))
      .catch(logError);
  }

  // Restore spell checker and auto correct
  const spellCheckerCheck = prefs.get('spell-checker-check');
  if (spellCheckerCheck) {
    const autoCorrect = prefs.get('spell-checker-auto-correct');
    const langCode = prefs.get('spell-checker-language');
    log('restoring spell checker', spellCheckerCheck, 'auto correct', autoCorrect, 'lang code', langCode);
    webView.send('spell-checker', spellCheckerCheck, autoCorrect, langCode);
  }

  // Show an 'app updated' notification
  if (prefs.get('notify-app-updated')) {
    webView.send('notify-app-updated');
    prefs.set('notify-app-updated', false);
  }
});

// Listen for did-finish-load
webView.addEventListener('did-finish-load', function () {
  log('webview did-finish-load');

  // Hide the loading splash screen
  const loadingSplashDiv = document.querySelector('.loader');
  loadingSplashDiv.style.opacity = 0;
  setTimeout(function () {
    loadingSplashDiv.style.display = 'none';
  }, 250);
});

// Forward context menu opens
webView.addEventListener('context-menu', function (event) {
  const params = JSON.stringify(event.params);
  log('sending context menu', params);
  const mwm = remote.getGlobal('application').mainWindowManager;
  if (mwm) {
    mwm.openContextMenu(params);
  }
  event.preventDefault();
});

// Animate the splash screen into view
document.addEventListener('DOMContentLoaded', function () {
  log('document DOMContentLoaded');

  // Show the loading splash screen
  const loadingSplashDiv = document.querySelector('.loader');
  loadingSplashDiv.style.opacity = 1;

  // In case did-finish-load isn't called, set a timeout
  setTimeout(function () {
    loadingSplashDiv.style.opacity = 0;
    setTimeout(function () {
      loadingSplashDiv.style.display = 'none';
    }, 250);
  }, 10 * 1000);
});

export default webView;
