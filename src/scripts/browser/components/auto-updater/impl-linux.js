import URL from 'url';

import BaseAutoUpdater from 'browser/components/auto-updater/base';

class AutoUpdater extends BaseAutoUpdater {

  checkForUpdates () {
    if (!this.latestReleaseUrl) {
      this.emit('error', new Error('Latest release URL is not set'));
      return;
    }

    const packageType = global.manifest.distrib.split(':')[1];
    let arch = null;

    if (packageType === 'deb') {
      arch = process.arch === 'ia32' ? 'i386' : 'amd64';
    } else {
      arch = process.arch === 'ia32' ? 'i386' : 'x86_64';
    }

    const urlObj = URL.parse(this.latestReleaseUrl);
    urlObj.query = urlObj.query || {};
    urlObj.query.pkg = packageType;
    urlObj.query.arch = arch;

    const url = URL.format(urlObj);
    super.checkForUpdates(url);
  }

}

export default new AutoUpdater();
