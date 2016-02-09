import filePaths from '../utils/file-paths';
import cp from 'child_process';
import path from 'path';
import app from 'app';

import AutoLauncher from './auto-launcher';

class SquirrelEvents {

  check(options) {
    if (options.squirrelInstall) {
      this.spawnSquirrel(['--createShortcut', app.getPath('exe')], this.eventHandled);
      return true;
    }

    if (options.squirrelUpdated || options.squirrelObsolete) {
      setTimeout(this.eventHandled);
      return true;
    }

    if (options.squirrelUninstall) {
      new AutoLauncher().disable(function(err) {
        if (err) {
          logError(err);
        }
        this.spawnSquirrel(['--removeShortcut', app.getPath('exe')], this.eventHandled);
      });
      return true;
    }

    return false;
  }

  spawnSquirrel(args, callback) {
    const squirrelExec = path.resolve(filePaths.getAppDir(), '..', 'Update.exe');
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

}

export default new SquirrelEvents();
