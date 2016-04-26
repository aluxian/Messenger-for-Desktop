import prefs from 'browser/utils/prefs';

function send(name, ...args) {
  const trackAnalytics = prefs.get('analytics-track');
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
