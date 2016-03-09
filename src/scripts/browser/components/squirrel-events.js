import filePaths from '../utils/file-paths';
import async from 'async';
import cp from 'child_process';
import app from 'app';
import del from 'del';

import AutoLauncher from './auto-launcher';
import manifest from '../../../package.json';

class SquirrelEvents {

  check(options) {
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
        ::this.teardownAutoLauncherRegKey,
        ::this.teardownLeftoverUserData,
        ::this.teardownShortcuts
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
        logError(squirrelExec, 'exited with code', code);
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
    log('removing leftover user data');
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
