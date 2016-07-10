import BaseAutoUpdater from 'browser/components/auto-updater/base';

class AutoUpdater extends BaseAutoUpdater {

  checkForUpdates () {
    if (!this.latestReleaseUrl) {
      this.emit('error', new Error('Latest release URL is not set'));
      return;
    }

    super.checkForUpdates(this.latestReleaseUrl);
  }

}

export default new AutoUpdater();
