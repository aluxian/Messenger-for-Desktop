import manifest from '../../../../package.json';
import request from 'request';
import semver from 'semver';
import app from 'app';

import EventEmitter from 'events';

class AutoUpdater extends EventEmitter {

  setFeedURL(latestReleaseUrl) {
    log('set feed url', latestReleaseUrl);
    this.latestReleaseUrl = latestReleaseUrl;
  }

  checkForUpdates() {
    if (!this.latestReleaseUrl) {
      this.emit('error', new Error('Latest release URL is not set'));
      return;
    }

    const packageType = manifest.distrib.split(':')[1];
    let arch = null;

    if (packageType == 'deb') {
      arch = process.arch == 'ia32' ? 'i386' : 'amd64';
    } else {
      arch = process.arch == 'ia32' ? 'i386' : 'x86_64';
    }

    const options = {
      url: this.latestReleaseUrl,
      qs: {
        pkg: packageType,
        arch: arch
      },
      json: true
    };

    log('checking for update', options);
    this.emit('checking-for-update');

    request(options, (err, response, json) => {
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
      const newVersionExists = semver.gt(newVersion, manifest.version);
      const downloadUrl = json.url;

      if (newVersionExists) {
        log('update available', newVersion);
        this.emit('update-available', newVersion, downloadUrl);
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
