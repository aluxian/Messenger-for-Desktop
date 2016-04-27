import BaseAutoUpdater from 'browser/components/auto-updater/base';

class AutoUpdater extends BaseAutoUpdater {

  checkForUpdates() {
    const packageType = global.manifest.distrib.split(':')[1];
    let arch = null;

    if (packageType == 'deb') {
      arch = process.arch == 'ia32' ? 'i386' : 'amd64';
    } else {
      arch = process.arch == 'ia32' ? 'i386' : 'x86_64';
    }

    super.checkForUpdates({
      url: this.latestReleaseUrl,
      qs: {
        pkg: packageType,
        arch: arch
      },
      json: true
    });
  }

}

export default new AutoUpdater();
