import CrashReporter from 'crash-reporter';
import remote from 'remote';

const manifest = remote.getGlobal('manifest');

if (!process.mas) {
  log('starting crash reporter');
  CrashReporter.start({
    productName: manifest.productName,
    companyName: manifest.win.companyName,
    submitURL: manifest.crashReporter.url,
    autoSubmit: true
  });
} else {
  log('mas release');
}
