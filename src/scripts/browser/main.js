import app from 'app';
import yargs from 'yargs';
import path from 'path';
import fs from 'fs';

// import CrashReporter from 'crash-reporter';
// import Updater from './components/updater';
// import SquirrelEvents from './components/squirrel-events';

import Application from './application';

import manifest from '../../package.json';

// Log uncaught exceptions
process.on('uncaughtException', error => console.error(error.stack || error));

(function() {
  // Check for Squirrel.Windows CLI args
  // if (SquirrelEvents.check()) {
  //   return;
  // }

  // Define the CLI arguments and parse them
  const argv = yargs
    .usage('Usage: $0 [options]')
    .boolean('os-startup').describe('os-startup', 'Flag to indicate the app is being ran by the OS on startup.')
    .boolean('portable').describe('portable', 'Run in portable mode.')
    .boolean('v').alias('v', 'version').describe('v', 'Print the app version.')
    .help('h').alias('h', 'help').describe('h', 'Print this help message.')
    .epilog('Created with <3 by Alexandru Rosianu – http://www.aluxian.com/')
    .argv;

  // Print the version and exit
  if (argv.version) {
    console.log(`${app.getName()} ${app.getVersion()}`);
    console.log(`Electron ${process.versions.electron}`);
    console.log(`Chromium ${process.versions.chrome}`);
    return app.quit();
  }

  // Enforce single instance
  const isDuplicateInstance = app.makeSingleInstance((argv, cwd) => {
    if (global.application) {
      const mainWindow = global.application.mainWindow;
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
