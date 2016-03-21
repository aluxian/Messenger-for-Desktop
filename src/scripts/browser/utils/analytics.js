import uuid from 'node-uuid';
import prefs from './prefs';

const trackAnalytics = prefs.get('analytics-track');

export function getUserId() {
  let uid = prefs.get('analytics-uid');

  // Generate a new one if it doesn't exist
  if (!uid) {
    uid = uuid.v4();
    prefs.set('analytics-uid', uid);
  }

  return uid;
}

function send(name, ...args) {
  if (!trackAnalytics) {
    return;
  }
  const browserWindow = global.application.mainWindowManager.window;
  if (browserWindow) {
    browserWindow.webContents.send('track-analytics', name, args);
  }
}

function bind(name) {
  return send.bind(null, name);
}

export default {
  trackEvent: bind('trackEvent'),
  trackGoal: bind('trackGoal')
};
