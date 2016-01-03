import remote from 'remote';

const manifest = remote.getGlobal('manifest');
const analytics = remote.require('../browser/utils/analytics');
const prefs = remote.require('../browser/utils/prefs').default;
const trackAnalytics = prefs.get('analytics-track');
let ga = null;

if (trackAnalytics) {
  log('enabling google analytics');

  /* eslint-disable semi */
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  /* eslint-enable semi */

  const gaOptions = {
    userId: analytics.getUserId(),
    trackingId: manifest.gaPropertyId,
    cookieDomain: 'auto',
    forceSSL: true,
    appId: manifest.name,
    appName: manifest.productName,
    appVersion: manifest.version,
    appInstallerId: manifest.distrib
  };

  log('creating ga instance', gaOptions);
  ga = window.ga;

  ga('create', gaOptions);
  ga('send', 'screenview', {
    screenName: 'main'
  });
} else {
  log('google analytics disabled');
}

export default ga;
