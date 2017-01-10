'use strict';

/**
 * URL match patterns to be filteresd
 * @see https://developer.chrome.com/extensions/match_patterns
 * @global
 * @constant
 */
const urlPatternList = [
  '*://*.facebook.com/*change_read_status*',
  '*://*.messenger.com/*change_read_status*',
  '*://*.facebook.com/*typ.php*',
  '*://*.messenger.com/*typ.php*'
];

/**
 * Enable request cancelling of urls matched by pattern list
 */
let enableRequestFilter = () => {
  const targetSession = global.application.mainWindowManager.window.webContents.session;
  targetSession.webRequest.onBeforeRequest({urls: urlPatternList}, (details, callback) => {
    log('request filter', 'blocked', details.url);
    callback({cancel: true});
  });

  log('request filter', 'enabled', urlPatternList.length, 'entries');
};

/**
 * Disable request cancelling of urls matched by pattern list
 */
let disableRequestFilter = () => {
  const targetSession = global.application.mainWindowManager.window.webContents.session;
  targetSession.webRequest.onBeforeRequest({urls: urlPatternList}, null);

  log('request filter', 'disabled');
};

/**
 * Setter convenience interface
 * @param {Boolean} enable - True/false to enable/disable filtering
 */
let setRequestFilter = (enable) => {
  if (enable) {
    enableRequestFilter();
  } else {
    disableRequestFilter();
  }
};

/**
 * @exports
 */
export default {
  enable: enableRequestFilter,
  disable: disableRequestFilter,
  set: setRequestFilter
};
