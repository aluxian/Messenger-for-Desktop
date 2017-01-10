'use strict';

const FILTER_URL_LIST = [
  '*://*.facebook.com/*change_read_status*',
  '*://*.messenger.com/*change_read_status*',
  '*://*.facebook.com/*typ.php*',
  '*://*.messenger.com/*typ.php*'
];

let createFilter = () => {
  return {urls: FILTER_URL_LIST};
};

let enableFilter = function () {
  this.targetSession = global.application.mainWindowManager.window.webContents.session;
  this.targetSession.webRequest.onBeforeRequest(createFilter(), (details, callback) => {
    callback({cancel: true});
  });
  log(`request filter enabled for: "${FILTER_URL_LIST.join(' ')}"`);
};

let disableFilter = function () {
  this.targetSession = global.application.mainWindowManager.window.webContents.session;
  this.targetSession.webRequest.onBeforeRequest(createFilter(), (details, callback) => {
    callback({cancel: false});
  });
  log(`request filter disabled for: "${FILTER_URL_LIST.join(' ')}"`);
};

export default {
  enable: enableFilter,
  disable: disableFilter
};
