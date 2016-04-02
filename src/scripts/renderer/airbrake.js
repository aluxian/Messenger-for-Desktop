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
    notice.session.distrib = manifest.distrib;
    notice.session.process_type = 'renderer';
    notice.session.electron_version = manifest.electronVersion;
    notice.session.app_version = manifest.version;
    notice.context.environment = manifest.airbrake.env;
    return notice;
  });

  // Ignore errors in development
  airbrake.addFilter(function(notice) {
    if (notice.context.environment === 'development') {
      return null;
    }
    return notice;
  });
} else {
  log('airbrake disabled');
}

export default airbrake;
