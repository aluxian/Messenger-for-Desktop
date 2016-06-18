import {app, dialog} from 'electron';
import cp from 'child_process';
import async from 'async';
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
      this.createShortcuts(this.exitApp);
      return true;
    }

    if (options.squirrelUpdated || options.squirrelObsolete) {
      setTimeout(this.exitApp);
      return true;
    }

    if (options.squirrelUninstall) {
      this.teardown(this.exitApp);
      return true;
    }

    return false;
  }

  createShortcuts (callback) {
    this.spawnSquirrel(['--createShortcut', this.getShortcutExeName()], () => callback());
  }

  removeShortcuts (callback) {
    this.spawnSquirrel(['--removeShortcut', this.getShortcutExeName()], () => callback());
  }

  getShortcutExeName () {
    return path.basename(app.getPath('exe'));
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
  spawnSquirrel (args, callback) {
    const squirrelExec = filePaths.getSquirrelUpdateExePath();
    log('spawning', squirrelExec, args);

    const child = cp.spawn(squirrelExec, args, {detached: true});
    child.on('close', function (code) {
      if (code) {
        logError(new Error(squirrelExec + ' exited with code ' + code));
      }
      callback(code || 0);
    });
  }

  exitApp (exitCode = 0) {
    app.exit(exitCode);
  }

  teardown (callback) {
    async.series([
      ::this.teardownShortcuts,
      ::this.teardownAutoLauncherRegKey,
      ::this.teardownLeftoverUserData
    ], (err) => {
      if (err) {
        // should not happen
        logError(err);
      }
      log('teardown finished');
      callback();
    });
  }

  teardownShortcuts (callback) {
    log('removing shortcuts');
    this.removeShortcuts(callback);
  }

  teardownAutoLauncherRegKey (callback) {
    log('removing reg keys');
    new AutoLauncher().disable()
      .catch(logError)
      .then(() => callback());
  }

  teardownLeftoverUserData (callback) {
    const userDataPath = app.getPath('userData');
    log('removing user data folder', userDataPath);
    del(userDataPath, {force: true})
      .then((paths) => log('deleted', paths))
      .catch(logError)
      .then(() => callback());
  }

}

export default new SquirrelEvents();
