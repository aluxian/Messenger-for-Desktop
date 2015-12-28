import manifest from '../../../package.json';
import ua from 'universal-analytics';
import uuid from 'node-uuid';
import prefs from './prefs';

export function getUserId() {
  let uid = prefs.get('analytics-uid');

  // Generate a new one if it doesn't exist
  if (!uid) {
    uid = uuid.v4();
    prefs.set('analytics-uid', uid);
  }

  return uid;
}

log('creating universal analytics instance');
export default ua(manifest.gaPropertyId, {
  userId: getUserId(),
  https: true
});
