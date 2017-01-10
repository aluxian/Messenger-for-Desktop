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
  const targetSession = global.application.mainWindowManager.window.webContents.session;

  targetSession.webRequest.onBeforeRequest(createFilter(), (details, callback) => {
    callback({cancel: true});
  });

  log(`request filter enabled (entries: ${FILTER_URL_LIST.length})`);
};

let disableFilter = function () {
  const targetSession = global.application.mainWindowManager.window.webContents.session;

  targetSession.webRequest.onBeforeRequest(createFilter(), (details, callback) => {
    callback({cancel: false});
  });

  log('request filter disabled');
};

export default {
  enable: enableFilter,
  disable: disableFilter
};
