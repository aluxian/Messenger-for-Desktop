import cp from 'child_process';
import path from 'path';
import app from 'app';
import del from 'del';

function spawnSquirrel(args, callback) {
  const squirrelExec = path.join(path.dirname(process.execPath), '..', 'Update.exe');
  console.log('[squirrel-events]', 'spawning', squirrelExec, args);

  cp.spawn(squirrelExec, args, { detached: true }).on('close', function(code) {
    if (code) {
      console.error('[squirrel-events]', squirrelExec, 'exited with code', code);
    } else {
      callback();
    }
  });
}

export default {
  check: function() {
    if (process.platform !== 'win32') {
      return false;
    }

    const squirrelCommand = process.argv[1];
    const execName = path.basename(process.execPath);

    switch (squirrelCommand) {
      case '--squirrel-install':
        spawnSquirrel(['--createShortcut', execName], app.quit);
        return true;

      case '--squirrel-uninstall':
        spawnSquirrel(['--removeShortcut', execName], app.quit);

        // Delete app data leftovers
        del(app.getPath('userData'));

        return true;

      case '--squirrel-updated':
        // Remove previous app dirs
        del(['../app-*/**', '!../app-' + app.getVersion() + '/**'], { force: true });

      case '--squirrel-obsolete':
        app.quit();
        return true;
    }

    return false;
  }
};
