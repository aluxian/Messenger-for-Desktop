import cp from 'child_process';
import dialog from 'dialog';
import async from 'async';
import app from 'app';
import del from 'del';

import filePaths from '../utils/file-paths';
import wafdCleaner from './wafd-cleaner';

import AutoLauncher from './auto-launcher';
import manifest from '../../../package.json';

class SquirrelEvents {

  check(options) {
    if (options.squirrelFirstrun) {
      if (options.portable) {
        return;
      }
      log('checking for WAFD leftovers');
      wafdCleaner.check(function(check) {
        if (check) {
          dialog.showMessageBox({
            type: 'question',
            message: 'Remove old WhatsApp for Desktop?',
            detail: 'Whatsie has found WhatsApp for Desktop files on your computer. Do you want to completely remove WhatsApp for Desktop and its files?',
            buttons: ['Remove', 'Skip'],
            defaultId: 0,
            cancelId: 1
          }, function(response) {
            if (response === 0) {
              log('user chose Remove');
              wafdCleaner.clean(function() {
                log('cleaning done');
              });
            } else {
              log('user chose Skip');
            }
          });
        }
      });
    }

    if (options.squirrelInstall) {
      log('creating shortcuts');
      this.spawnSquirrel(['--createShortcut', app.getPath('exe')], this.eventHandled);
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
        log('teardown complete');
      });
      return true;
    }

    return false;
  }

  spawnSquirrel(args, callback) {
    const squirrelExec = filePaths.getSquirrelUpdateExe();
    log('spawning', squirrelExec, args);

    const child = cp.spawn(squirrelExec, args, { detached: true });
    child.on('close', function(code) {
      if (code) {
        logError(new Error(squirrelExec, 'exited with code', code));
      }
      callback(code || 0);
    });
  }

  eventHandled(exitCode = 0) {
    app.exit(exitCode);
  }

  teardownAutoLauncherRegKey(cb) {
    log('removing reg keys');
    new AutoLauncher().disable((err) => {
      if (err) {
        logError(err);
      }
      cb();
    });
  }

  teardownLeftoverUserData(cb) {
    log('removing user data folder', app.getPath('userData'));
    del(app.getPath('userData'), { force: true })
      .catch((err) => {
        logError(err);
        cb();
      })
      .then((paths) => {
        log('deleted', paths);
        cb();
      });
  }

  teardownShortcuts(cb) {
    log('removing shortcuts');
    const args = ['--removeShortcut', manifest.productName + '.exe'];
    this.spawnSquirrel(args, this.eventHandled);
    cb();
  }

}

export default new SquirrelEvents();
