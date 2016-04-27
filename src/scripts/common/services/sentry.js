import os from 'os';

import prefs from 'common/utils/prefs';
import {getUserId} from 'common/utils/analytics';

const trackAnalytics = prefs.get('analytics-track');
let client = null;

if (global.manifest.dev) {
  log('sentry disabled (dev mode)');
} else if (!trackAnalytics) {
  log('sentry disabled (analytics disabled)');
} else {
  log('setting up sentry');

  client = require(process.type + '/services/sentry').getClient();

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
    process_type: 'renderer',
    distrib: global.manifest.distrib,
    os_platform: os.platform()
  });
}

export default client;
