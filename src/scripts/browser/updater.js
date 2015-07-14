import fs from 'fs';
import shell from 'shell';
import dialog from 'dialog';
import mustache from 'mustache';
import request from 'request';
import semver from 'semver';

export default {
  checkAndPrompt: function(manifest) {
    return new Promise(function(resolve, reject) {
      request(manifest.updater.manifestUrl, function(reqErr, response, body) {
        if (reqErr) {
          console.error('[updater]', 'error while checking for update:', reqErr);
          return resolve(false); // ignore errors
        }

        const newManifest = JSON.parse(body);
        const newVersionExists = semver.gt(newManifest.version, manifest.version);

        if (!newVersionExists) {
          console.log('[updater]', 'using the latest version:', manifest.version);
          return resolve(false);
        } else {
          console.log('[updater]', 'new version available:', newManifest.version);
        }

        dialog.showMessageBox({
          type: 'question',
          message: `There' a new app version available (v${newManifest.version}). Would you like to update now?`,
          buttons: ['Yes', 'No'],
          cancelId: 1
        }, function(buttonId) {
          if (buttonId !== 0) {
            console.log('[updater]', 'user chose not to update');
            return resolve(false);
          }

          let platform = process.platform;

          if (platform === 'win32') {
            platform = 'win';
          } else if (platform !== 'darwin') {
            platform = 'linux';
          }

          if (platform === 'linux') {
            fs.readFile('/opt/' + manifest.name + '/pkgtarget', 'utf8', function(readErr, target) {
              if (readErr) {
                return reject(readErr);
              }

              let link = newManifest.updater.download.linux[target][process.arch];
              link = mustache.render(link, newManifest);

              console.log('[updater]', 'the user seems to be on a ' + target + '-based linux');
              console.log('[updater]', 'user confirmed update, opening link:', link);

              shell.openExternal(link);
              resolve(true);
            });
          } else {
            let link = newManifest.updater.download[platform];
            link = mustache.render(link, newManifest);

            console.log('[updater]', 'user confirmed update, opening link:', link);
            shell.openExternal(link);
            resolve(true);
          }
        });
      });
    });
  }
};
