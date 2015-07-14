import cp from 'child_process';
import path from 'path';
import app from 'app';

function spawnSquirrel(args, callback) {
  const squirrelExec = path.join(path.dirname(process.execPath), 'Squirrel.exe');
  cp.spawn(squirrelExec, args, { detached: true }).on('close', function(code) {
    if (code) {
      console.error(squirrelExec, 'exited with code', code);
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
    switch (squirrelCommand) {
      case '--squirrel-install':
        spawnSquirrel(['--createShortcut', process.execPath], app.quit);
        return true;

      case '--squirrel-uninstall':
        spawnSquirrel(['--removeShortcut', process.execPath], app.quit);
        return true;

      case '--squirrel-updated':
      case '--squirrel-obsolete':
        app.quit();
        return true;
    }

    return false;
  }
};
