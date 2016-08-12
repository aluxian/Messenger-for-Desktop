import {app} from 'electron';
import cp from 'child_process';
import path from 'path';
import del from 'del';

import AutoLauncher from 'browser/components/auto-launcher';
import filePaths from 'common/utils/file-paths';

class SquirrelEvents {

  check (options) {
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
    await del(path.join(userDataPath, '**'), {force: true})
      .then((files) => log('deleted', JSON.stringify(files)));
  }

}

export default new SquirrelEvents();
