import filePaths from '../utils/file-paths';
import cp from 'child_process';
import app from 'app';
import del from 'del';

import AutoLauncher from './auto-launcher';
import manifest from '../../../package.json';

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
      // Remove auto-launch registry key
      new AutoLauncher().disable(function(err) {
        if (err) {
          logError(err);
        }
        // Remove leftover user data
        del(app.getPath('userData'))
          .catch(logError)
          .then(() => {
            // Remove shortcuts
            const args = ['--removeShortcut', manifest.productName + '.exe'];
            this.spawnSquirrel(args, this.eventHandled);
          });
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

}

export default new SquirrelEvents();
