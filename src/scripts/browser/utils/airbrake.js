import Airbrake from 'airbrake';
import app from 'app';

import manifest from '../../../package.json';
import prefs from './prefs';

const trackAnalytics = prefs.get('analytics-track');
let airbrake = null;

if (trackAnalytics) {
  log('setting up airbrake');

  airbrake = Airbrake.createClient(
    manifest.airbrake.projectId,
    manifest.airbrake.projectKey,
    manifest.airbrake.env
  );

  // Configuration
  airbrake.host = manifest.airbrake.host;
  airbrake.serviceHost = manifest.airbrake.serviceHost;
  airbrake.projectRoot = app.getAppPath();
  airbrake.appVersion = manifest.version;
  airbrake.consoleLogError = true;
} else {
  log('airbrake disabled');
}

export default airbrake;
