import app from 'app';
import yargs from 'yargs';
import path from 'path';

// import CrashReporter from 'crash-reporter';
// import Updater from './components/updater';
import SquirrelEvents from './components/squirrel-events';

import Application from './application';

import manifest from '../../package.json';

// Log uncaught exceptions
process.on('uncaughtException', error => console.error(error.stack || error));

(function() {
  // Define the CLI arguments and parse them
  const argv = yargs
    .usage('Usage: $0 [options]')
    .boolean('os-startup')
    .boolean('portable')
    .boolean('version').alias('version', 'v')
    .boolean('squirrel-install')
    .boolean('squirrel-uninstall')
    .boolean('squirrel-updated')
    .boolean('squirrel-obsolete')
    .help('h').alias('h', 'help')
    .describe('os-startup', 'Flag to indicate the app is being ran by the OS on startup.')
    .describe('portable', 'Run in portable mode.')
    .describe('version', 'Print the app version.')
    .describe('squirrel-install', 'Squirrel.Windows flag, called when the app is installed.')
    .describe('squirrel-updated', 'Squirrel.Windows flag, called after the app is updated.')
    .describe('squirrel-uninstall', 'Squirrel.Windows flag, called when the app is uninstalled.')
    .describe('squirrel-obsolete', 'Squirrel.Windows flag, called before updating to a new version.')
    .describe('h', 'Print this help message.')
    .epilog('Created with <3 by Alexandru Rosianu – http://www.aluxian.com/')
    .argv;

  // Check for Squirrel.Windows CLI args
  if (process.platform == 'win32' && SquirrelEvents.check(argv)) {
    return;
  }

  // Print the version and exit
  if (argv.version) {
    console.log(`${app.getName()} ${app.getVersion()}`);
    console.log(`Electron ${process.versions.electron}`);
    console.log(`Chromium ${process.versions.chrome}`);
    return app.quit();
  }

  // Enforce single instance
  const isDuplicateInstance = app.makeSingleInstance(() => {
    if (global.application) {
      const mainWindow = global.application.mainWindowManager.window;
      if (mainWindow) {
        if (mainWindow.isMinimized()) {
          mainWindow.restore();
        }
        mainWindow.focus();
      }
    }
    return true;
  });

  if (isDuplicateInstance) {
    log('another instance of the app is already running');
    return app.quit();
  }

  // Change the userData path if in portable mode
  if (argv.portable || manifest.portable) {
    log('running in portable mode');
    log('setPath', path.join(app.getAppPath(), 'data'));
    app.setPath('userData', path.join(app.getAppPath(), 'data'));
  }

  // Enable the crash reporter
  // app.on('will-finish-launching', function() {
  //   CrashReporter.start(manifest.crashReporter); // fix manifest.crashReporter
  //   // start the auto updater
  // });

  // Check for update and create the main app object
  app.on('ready', function() {
    log('ready, launching app');
    global.manifest = manifest;
    global.application = new Application(manifest, argv);
    global.application.init();
    // Updater.checkAndPrompt(manifest, false)
    //   .then(function(willUpdate) {
    //     if (willUpdate) {
    //       return app.quit();
    //     }
    //
    //     global.application = new Application(manifest, argv);
    //   })
    //   .catch(::console.error);
  });
})();
