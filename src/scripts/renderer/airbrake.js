import Airbrake from 'airbrake-js';
import remote from 'remote';
import url from 'url';

const manifest = remote.getGlobal('manifest');
const prefs = remote.require('../browser/utils/prefs').default;
const trackAnalytics = prefs.get('analytics-track');
let airbrake = null;

export function resolveUrl(urlToResolve) {
  return url.resolve(manifest.airbrake.host, urlToResolve || '');
}

if (trackAnalytics) {
  log('setting up airbrake');

  airbrake = new Airbrake({
    projectId: manifest.airbrake.projectId,
    projectKey: manifest.airbrake.projectKey,
    host: 'https://' + manifest.airbrake.serviceHost
  });

  // Add more data
  airbrake.addFilter(function(notice) {
    notice.environment = notice.environment || {};
    notice.context = notice.context || {};

    notice.environment.distrib = manifest.distrib;
    notice.context.environment = manifest.airbrake.env;
    notice.context.version = manifest.version;
    notice.params = manifest;

    if (notice.error && notice.error.fakePagePath) {
      notice.context.url = notice.error.fakePagePath;
    }

    return notice;
  });

  // Ignore errors in development
  airbrake.addFilter(function(notice) {
    if (notice.context.environment === 'development') {
      return null;
    }
    return notice;
  });

  // Replace username in C:\Users\<username>\AppData\
  airbrake.addFilter(function(notice) {
    if (notice.error && notice.error.message) {
      const exMsgBits = notice.error.message.split('\\');
      const c1 = exMsgBits[0] === 'C:';
      const c2 = exMsgBits[1] === 'Users';
      const c3 = exMsgBits[3] === 'AppData';
      if (c1 && c2 && c3) {
        exMsgBits[2] = '<username>';
        notice.error.message = exMsgBits.join('\\');
      }
    }
    return notice;
  });
} else {
  log('airbrake disabled');
}

export default airbrake;
