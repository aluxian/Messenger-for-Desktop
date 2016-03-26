import remote from 'remote';

const manifest = remote.getGlobal('manifest');
const prefs = remote.require('../browser/utils/prefs').default;

if (!process.mas) {
  if (manifest.crashReporter && manifest.crashReporter.url) {
    if (prefs.get('analytics-track')) {
      const reporterOptions = {
        productName: manifest.productName,
        companyName: manifest.win.companyName,
        submitURL: manifest.crashReporter.url,
        autoSubmit: true
      };

      log('starting crash reporter', JSON.stringify(reporterOptions));
      const CrashReporter = require('crash-reporter');
      CrashReporter.start(reporterOptions);
    } else {
      log('analytics disabled, so crash reporter disabled');
    }
  } else {
    log('crash reporter url not configured');
  }
} else {
  log('mas release');
}
