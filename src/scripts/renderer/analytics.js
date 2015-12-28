import remote from 'remote';

const manifest = remote.getGlobal('manifest');
const analytics = remote.require('../browser/utils/analytics');
const prefs = remote.require('../browser/utils/prefs').default;
const trackAnalytics = prefs.get('track-analytics', true);

if (trackAnalytics) {
  log('enabling google analytics');

  /* eslint-disable semi */
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  /* eslint-enable semi */

  window.ga('create', {
    trackingId: manifest.gaPropertyId,
    cookieDomain: 'auto',
    userId: analytics.getUserId()
  });
  window.ga('set', 'dimension1', manifest.version);
  window.ga('set', 'dimension2', manifest.distrib);
  window.ga('send', 'pageview');

  log('reported dimensions:', {
    version: manifest.version,
    distrib: manifest.distrib
  });
} else {
  log('google analytics disabled');
}
