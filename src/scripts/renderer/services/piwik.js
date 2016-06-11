import prefs from 'common/utils/prefs';
import {getUserId} from 'common/utils/analytics';

const activeTheme = prefs.get('theme');
const activeSpellCheckerLang = prefs.get('spell-checker-language');
const activeReleaseChannel = prefs.get('updates-channel');
const trackAnalytics = prefs.get('analytics-track');

let piwikTracker = null;

if (global.manifest.dev) {
  log('piwik disabled (dev mode)');
} else if (!trackAnalytics) {
  log('piwik disabled (analytics disabled)');
} else {
  log('setting up piwik');

  // Configure
  window.piwikAsyncInit = function () {
    try {
      piwikTracker = window.Piwik.getTracker();
      piwikTracker.setDocumentTitle(document.title);
      piwikTracker.setTrackerUrl(global.manifest.piwik.serverUrl + '/piwik.php');
      piwikTracker.setCustomDimension(1, global.manifest.version); // Version
      piwikTracker.setCustomDimension(2, activeReleaseChannel); // Release Channel
      piwikTracker.setCustomDimension(3, global.manifest.distrib); // Distrib
      piwikTracker.setCustomDimension(4, activeTheme); // Theme
      piwikTracker.setCustomDimension(5, activeSpellCheckerLang); // Spell Checker Language
      piwikTracker.setUserId(getUserId());
      piwikTracker.setSiteId(global.manifest.piwik.siteId);
      piwikTracker.trackPageView();
      log('piwik analytics instance created');
    } catch (err) {
      logFatal(err);
    }
  };

  // Load the tracking lib
  const scriptElem = document.createElement('script');
  scriptElem.type = 'text/javascript';
  scriptElem.async = true;
  scriptElem.defer = true;
  scriptElem.src = global.manifest.piwik.serverUrl + '/piwik.js';
  document.head.appendChild(scriptElem);
}

export function getTracker () {
  return piwikTracker;
}
