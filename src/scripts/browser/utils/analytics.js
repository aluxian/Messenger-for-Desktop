import manifest from '../../../package.json';
import ua from 'universal-analytics';
import uuid from 'node-uuid';
import prefs from './prefs';

const trackAnalytics = prefs.get('analytics-track');
let analytics = null;

export function getUserId() {
  let uid = prefs.get('analytics-uid');

  // Generate a new one if it doesn't exist
  if (!uid) {
    uid = uuid.v4();
    prefs.set('analytics-uid', uid);
  }

  return uid;
}

if (trackAnalytics) {
  log('creating universal analytics instance');
  analytics = ua(manifest.gaPropertyId, {
    userId: getUserId(),
    https: true
  });
} else {
  log('universal analytics disabled');
}

export default analytics;
