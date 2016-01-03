import manifest from '../../../../package.json';
import request from 'request';
import semver from 'semver';
import app from 'app';

import EventEmitter from 'events';

class AutoUpdater extends EventEmitter {

  setFeedURL(manifestUrl) {
    log('set feed url', manifestUrl);
    this.manifestUrl = manifestUrl;
  }

  checkForUpdates() {
    if (!this.manifestUrl) {
      log('Update URL is not set');
      this.emit('error', new Error('Update URL is not set'));
      return;
    }

    const options = {
      url: this.manifestUrl,
      json: true
    };

    log('checking for update', options);
    this.emit('checking-for-update');

    request(options, (err, response, newManifest) => {
      if (err) {
        log('update error while getting new manifest', err);
        this.emit('error', err);
        return;
      }

      if (response.statusCode < 200 || response.statusCode >= 300) {
        log('update error statusCode', response.statusCode);
        this.emit('error', new Error(response.statusMessage));
        return;
      }

      const newVersionExists = semver.gt(newManifest.version, manifest.version);
      if (newVersionExists) {
        log('update available', newManifest.version);
        this.emit('update-available');
      } else {
        log('app version up to date', manifest.version);
        this.emit('update-not-available');
      }
    });
  }

  quitAndInstall() {
    log('quit and install');
    app.quit();
  }

}

export default new AutoUpdater();
