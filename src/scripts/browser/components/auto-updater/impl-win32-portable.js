import BaseAutoUpdater from './base';

class AutoUpdater extends BaseAutoUpdater {

  checkForUpdates() {
    super.checkForUpdates({
      url: this.latestReleaseUrl,
      json: true
    });
  }

}

export default new AutoUpdater();
