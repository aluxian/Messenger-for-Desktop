import raven from 'raven';
import os from 'os';

import {getUserId} from 'common/utils/analytics';
import prefs from 'browser/utils/prefs';

const trackAnalytics = prefs.get('analytics-track');
let client = null;

if (global.manifest.dev) {
  log('sentry disabled (dev mode)');
} else if (!trackAnalytics) {
  log('sentry disabled (analytics disabled)');
} else {
  log('setting up sentry');

  client = new raven.Client(global.manifest.sentry.dsn.private, {
    release: global.manifest.version,
    name: global.manifest.productName
  });

  client.setUserContext({
    uid: getUserId()
  });

  client.setExtraContext({
    portable: global.manifest.portable,
    buildNum: global.manifest.buildNum,
    os_release: os.release(),
    versions: {
      electron: global.manifest.electronVersion,
      app: global.manifest.version
    },
    prefs: prefs.getAll()
  });

  client.setTagsContext({
    process_type: 'browser',
    distrib: global.manifest.distrib,
    os_platform: os.platform()
  });

  client.on('error', function(err) {
    console.error('Error reporting to sentry:', {
      statusCode: err.statusCode,
      reason: err.reason
    });
  });
}

export default client;
