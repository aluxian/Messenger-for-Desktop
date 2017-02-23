import url from 'url';

/**
 * Skip opening the link through Facebook.
 * It converts [facebook|messenger].com/l.php?u=<encodedUrl> to <unencodedUrl>.
 */
function skipFacebookRedirect (urlLink) {
  const parsed = url.parse(urlLink, true);
  const hostMatches = parsed.hostname.includes('facebook.com') || parsed.hostname.includes('messenger.com');
  const pathMatches = parsed.pathname.includes('/l.php');

  if (hostMatches && pathMatches && parsed.query.u) {
    urlLink = parsed.query.u;
  }

  return urlLink;
}

/**
 * Check if the given url is a downloadable file. Currently only detects Facebook CDN urls.
 */
function isDownloadUrl (urlLink) {
  return urlLink.startsWith('https://cdn.fbsbx.com') && urlLink.endsWith('&dl=1');
}

export default {
  skipFacebookRedirect,
  isDownloadUrl
};
