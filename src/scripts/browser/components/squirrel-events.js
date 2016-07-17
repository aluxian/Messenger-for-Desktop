import {app, dialog} from 'electron';
import cp from 'child_process';
import path from 'path';
import del from 'del';

import AutoLauncher from 'browser/components/auto-launcher';
import wafdCleaner from 'browser/components/wafd-cleaner';
import filePaths from 'common/utils/file-paths';

class SquirrelEvents {

  check (options) {
    if (options.squirrelFirstrun) {
      this.onSquirrelFirstrun(options);
      return false;
    }

    if (options.squirrelInstall) {
      log('creating shortcuts');
      this.spawnSquirrel('--createShortcut', this.getShortcutExeName()).then(this.exitApp);
      return true;
    }

    if (options.squirrelUpdated || options.squirrelObsolete) {
      setTimeout(this.exitApp);
      return true;
    }

    if (options.squirrelUninstall) {
      this.teardown().then(this.exitApp);
      return true;
    }

    return false;
  }

  getShortcutExeName () {
    return path.basename(app.getPath('exe'));
  }

  exitApp (exitCode = 0) {
    app.exit(exitCode);
  }

  onSquirrelFirstrun (options) {
    if (options.portable) {
      return;
    }

    const showErrorDialog = function (msg, errMsg, files = []) {
      let filesDeletedMsg = ' No files have been removed.';
      if (files.length) {
        filesDeletedMsg = ' Only the following files have been removed:\n\n' + files.join('\n');
      }

      let originalErrMsg = '';
      if (errMsg) {
        originalErrMsg = '\n\nERR: ' + errMsg.substr(0, 1024);
      }

      dialog.showMessageBox({
        type: 'error',
        message: 'Error: ' + msg + filesDeletedMsg + originalErrMsg
      }, function () {});
    };

    const responseCallback = function (response) {
      if (response === 1) {
        log('user chose Remove');
        wafdCleaner.clean(function (err, files) {
          if (err) {
            if (err.code === 'EPERM') {
              const displayMessage = global.manifest.productName +
                ' doesn\'t have permission to remove one of the files or folders.';
              showErrorDialog(displayMessage, err.message, files);
              logError(err, true);
            } else if (err.code === 'EBUSY') {
              const displayMessage = 'One of the files or folders is being used by another program.';
              showErrorDialog(displayMessage, err.message, files);
              logError(err, true);
            } else {
              logError(err);
            }
          } else {
            log('cleaning done, deleted:', files || []);
          }
        });
      } else {
        log('user chose Skip');
      }
    };

    log('checking for WAFD leftovers');
    wafdCleaner.check(function (err, leftovers) {
      if (err) {
        logError(err);
      } else if (leftovers && leftovers.length) {
        dialog.showMessageBox({
          type: 'question',
          message: 'Remove old WhatsApp for Desktop?',
          detail: global.manifest.productName + ' has found files from WhatsApp for Desktop on your computer.' +
            ' Do you want to permanently delete the following files and folders?\n\n' +
            leftovers.join('\n') + '\n\nBefore pressing Remove, make sure WhatsApp for' +
            ' Desktop is not running.',
          buttons: ['Skip', 'Remove']
        }, responseCallback);
      }
    });
  }

  /**
   * Spawn Squirrel's Update.exe with the given arguments.
   */
  async spawnSquirrel (...args) {
    const squirrelExec = filePaths.getSquirrelUpdateExePath();
    log('spawning', squirrelExec, args);

    const child = cp.spawn(squirrelExec, args, {detached: true});
    return await new Promise((resolve, reject) => {
      child.on('close', function (code) {
        if (code) {
          logError(new Error(squirrelExec + ' exited with code ' + code));
        }
        resolve(code || 0);
      });
    });
  }

  async teardown () {
    try { await this.teardownShortcuts(); } catch (err) { logError(err, true); }
    try { await this.teardownAutoLauncherRegKey(); } catch (err) { logError(err, true); }
    try { await this.teardownLeftoverUserData(); } catch (err) { logError(err, true); }
    log('teardown finished');
  }

  async teardownShortcuts () {
    log('removing shortcuts');
    await this.spawnSquirrel('--removeShortcut', this.getShortcutExeName());
  }

  async teardownAutoLauncherRegKey () {
    log('removing reg keys');
    await new AutoLauncher().disable();
  }

  async teardownLeftoverUserData () {
    const userDataPath = app.getPath('userData');
    log('removing user data folder', userDataPath);
    await del(userDataPath, {force: true}).then(log.bind(null, 'deleted'));
  }

}

export default new SquirrelEvents();
