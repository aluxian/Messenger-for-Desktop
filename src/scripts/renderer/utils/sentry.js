import Raven from 'raven-js';
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

  Raven.config(global.manifest.sentry.dsn.public, {
    release: global.manifest.version,
    name: global.manifest.productName,
    collectWindowErrors: false,
    dataCallback: function(data) {
      console.log('DATA!!!=', data);
      return data;
    }
  }).install();

  Raven.setUserContext({
    uid: getUserId()
  });

  Raven.setExtraContext({
    portable: global.manifest.portable,
    buildNum: global.manifest.buildNum,
    os_release: os.release(),
    versions: {
      electron: global.manifest.electronVersion,
      app: global.manifest.version
    },
    prefs: prefs.getAll()
  });

  Raven.setTagsContext({
    process_type: 'renderer',
    distrib: global.manifest.distrib,
    os_platform: os.platform()
  });

  client = Raven;
}

export default client;
