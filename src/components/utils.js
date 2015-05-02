var URL = require('url');

module.exports = {
  /**
   * Skip opening the link through Facebook.
   */
  skipFacebookRedirect: function(url) {
    var parsed = URL.parse(url, true);
    var hostMatches = parsed.hostname.indexOf('facebook.com') > -1 || parsed.hostname.indexOf('messenger.com') > -1;
    var pathMatches = parsed.pathname.indexOf('/l.php') > -1;

    if (hostMatches && pathMatches && parsed.query.u) {
      url = decodeURIComponent(parsed.query.u);
    }

    return url;
  }
};
