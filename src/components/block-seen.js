var settings = require('./settings');

var DEFAULT_URL_LIST = [
  '*://*.facebook.com/*change_read_status*',
  '*://*.messenger.com/*change_read_status*',
  '*://*.facebook.com/*typ.php*',
  '*://*.messenger.com/*typ.php*'
];

var requestHandler = function(details) {
  return {
    cancel: true
  };
};

/**
 * Enable or disable request blocking.
 */
module.exports = {
  set: function(value) {
    var blockSeen = Boolean(value);
    if (blockSeen) {
      chrome.webRequest.onBeforeRequest.addListener(requestHandler, {
        urls: DEFAULT_URL_LIST
      }, ['blocking']);
    } else {
      chrome.webRequest.onBeforeRequest.removeListener(requestHandler);
    };
    settings.updateKey('blockSeen', blockSeen);
  }
};
