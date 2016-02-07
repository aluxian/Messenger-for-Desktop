import filePaths from '../utils/file-paths';
import cp from 'child_process';
import path from 'path';
import app from 'app';

import AutoLauncher from './auto-launcher';

class SquirrelEvents {

  check(options) {
    if (options.squirrelInstall) {
      this.spawnSquirrel(['--createShortcut', app.getPath('exe')], app.exit);
      return true;
    }

    if (options.squirrelUpdated || options.squirrelObsolete) {
      app.exit(0);
      return true;
    }

    if (options.squirrelUninstall) {
      AutoLauncher.disable(function(err) {
        if (err) {
          logError(err);
        }
        this.spawnSquirrel(['--removeShortcut', app.getPath('exe')], app.exit);
      });
      return true;
    }

    return false;
  }

  spawnSquirrel(args, callback) {
    const squirrelExec = path.join(filePaths.getAppDir(), 'Update.exe');
    log('spawning', squirrelExec, args);

    const child = cp.spawn(squirrelExec, args, { detached: true });
    child.on('close', function(code) {
      if (code) {
        logError(squirrelExec, 'exited with code', code);
      }
      callback(code || 0);
    });
  }

}

export default new SquirrelEvents();
