import uuid from 'node-uuid';

import prefs from 'common/utils/prefs';

export function getUserId () {
  let uid = prefs.get('analytics-uid');

  // Generate a new one if it doesn't exist
  if (!uid) {
    uid = uuid.v4();
    prefs.set('analytics-uid', uid);
  }

  return uid;
}
