import remote from 'remote';

const manifest = remote.getGlobal('manifest');
const prefs = remote.require('../browser/utils/prefs').default;
const analytics = prefs.get('analytics', false);

if (analytics) {
  log('enabling google analytics');

  /* eslint-disable semi */
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  /* eslint-enable semi */

  /* eslint-disable no-undef */
  ga('create', manifest.gaPropertyId, 'auto');
  ga('set', 'dimension1', manifest.version);
  ga('set', 'dimension2', manifest.distrib);
  ga('send', 'pageview');
  /* eslint-enable no-undef */

  log('reported dimensions:', {
    version: manifest.version,
    distrib: manifest.distrib
  });
} else {
  log('google analytics disabled');
}
