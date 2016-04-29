import cp from 'child_process';
import dialog from 'dialog';
import async from 'async';
import path from 'path';
import app from 'app';
import del from 'del';

import filePaths from 'common/utils/file-paths';
import wafdCleaner from 'browser/components/wafd-cleaner';
import AutoLauncher from 'browser/components/auto-launcher';

class SquirrelEvents {

  check(options) {
    if (options.squirrelFirstrun) {
      this.onSquirrelFirstrun(options);
      return false;
    }

    if (options.squirrelInstall) {
      log('creating shortcuts');
      this.spawnSquirrel(['--createShortcut', path.basename(app.getPath('exe'))], this.eventHandled);
      return true;
    }

    if (options.squirrelUpdated || options.squirrelObsolete) {
      setTimeout(this.eventHandled);
      return true;
    }

    if (options.squirrelUninstall) {
      async.series([
        ::this.teardownShortcuts,
        ::this.teardownAutoLauncherRegKey,
        ::this.teardownLeftoverUserData
      ], function() {
        log('teardown finished');
      });
      return true;
    }

    return false;
  }

  onSquirrelFirstrun(options) {
    if (options.portable) {
      return;
    }

    const showErrorDialog = function(msg, errMsg, files = []) {
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
      }, function() {});
    };

    const responseCallback = function(response) {
      if (response === 1) {
        log('user chose Remove');
        wafdCleaner.clean(function(err, files) {
          if (err) {
            if (err.code == 'EPERM') {
              const displayMessage = global.manifest.productName +
                ' doesn\'t have permission to remove one of the files or folders.';
              showErrorDialog(displayMessage, err.message, files);
              logError(err, true);
            } else if (err.code == 'EBUSY') {
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
    wafdCleaner.check(function(err, leftovers) {
      if (err) {
        logError(err);
      } else if (leftovers && leftovers.length) {
        dialog.showMessageBox({
          type: 'question',
          message: 'Remove old WhatsApp for Desktop?',
          detail: global.manifest.productName + ' has found files from WhatsApp for Desktop on your computer.'
            + ' Do you want to permanently delete the following files and folders?\n\n'
            + leftovers.join('\n') + '\n\nBefore pressing Remove, make sure WhatsApp for'
            + ' Desktop is not running.',
          buttons: ['Skip', 'Remove']
        }, responseCallback);
      }
    });
  }

  spawnSquirrel(args, callback) {
    const squirrelExec = filePaths.getSquirrelUpdateExePath();
    log('spawning', squirrelExec, args);

    const child = cp.spawn(squirrelExec, args, { detached: true });
    child.on('close', function(code) {
      if (code) {
        logError(squirrelExec, 'exited with code', code);
      }
      callback(code || 0);
    });
  }

  eventHandled(exitCode = 0) {
    app.exit(exitCode);
  }

  teardownAutoLauncherRegKey(callback) {
    log('removing reg keys');
    new AutoLauncher().disable()
      .then(() => callback())
      .catch(err => {
        logError(err);
        callback();
      });
  }

  teardownLeftoverUserData(callback) {
    log('removing user data folder', app.getPath('userData'));
    del(app.getPath('userData'), { force: true })
      .then(paths => {
        log('deleted', paths);
          callback();
      })
      .catch(err => {
        logError(err);
        callback();
      });
  }

  teardownShortcuts(callback) {
    log('removing shortcuts');
    const args = ['--removeShortcut', global.manifest.productName + '.exe'];
    this.spawnSquirrel(args, this.eventHandled);
    callback();
  }

}

export default new SquirrelEvents();
