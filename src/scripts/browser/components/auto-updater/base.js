import EventEmitter from 'events';
import needle from 'needle';
import {app} from 'electron';
import semver from 'semver';

class BaseAutoUpdater extends EventEmitter {

  setFeedURL (latestReleaseUrl) {
    log('set feed url', latestReleaseUrl);
    this.latestReleaseUrl = latestReleaseUrl;
  }

  checkForUpdates (url) {
    log('checking for update', url);
    this.emit('checking-for-update');

    needle.get(url, {json: true}, (err, response, json) => {
      if (err) {
        log('update error while getting json', err);
        this.emit('error', err);
        return;
      }

      if (response.statusCode < 200 || response.statusCode >= 300) {
        log('update error statusCode', response.statusCode);
        this.emit('error', new Error(response.statusMessage));
        return;
      }

      const newVersion = json.version;
      const newVersionExists = semver.gt(newVersion, global.manifest.version);
      const downloadUrl = json.url;

      if (newVersionExists) {
        log('update available', newVersion, downloadUrl);
        this.emit('update-available', newVersion, downloadUrl);
      } else {
        log('app version up to date', global.manifest.version);
        this.emit('update-not-available');
      }
    });
  }

  quitAndInstall () {
    log('quit and install');
    app.quit();
  }

}

export default BaseAutoUpdater;
