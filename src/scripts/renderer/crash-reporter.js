import remote from 'remote';

const manifest = remote.getGlobal('manifest');

if (!process.mas) {
  if (manifest.crashReporter && manifest.crashReporter.url) {
    log('starting crash reporter');
    const CrashReporter = require('crash-reporter');
    CrashReporter.start({
      productName: manifest.productName,
      companyName: manifest.win.companyName,
      submitURL: manifest.crashReporter.url,
      autoSubmit: true
    });
  } else {
    log('crash reporter url not configured');
  }
} else {
  log('mas release');
}
