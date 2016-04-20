import BaseAutoUpdater from './base';
import manifest from '../../../../package.json';

class AutoUpdater extends BaseAutoUpdater {

  checkForUpdates() {
    const packageType = manifest.distrib.split(':')[1];
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
