import app from 'app';
import yargs from 'yargs';

import CrashReporter from 'crash-reporter';

import Updater from './updater';
import SquirrelEvents from './squirrel-events';
import Application from './application';

import manifest from '../../package.json';

// Log uncaught exceptions
process.on('uncaughtException', error => console.error(error.stack));

(function main() {
  // Check for Squirrel.Windows CLI args
  if (SquirrelEvents.check()) {
    return;
  }

  // Define the CLI and parse arguments
  const argv = yargs
    .usage('Usage: $0 [options]')
    .boolean('os-startup').describe('os-startup', 'Flag to indicate the app is being ran by the OS on startup.')
    .boolean('v').alias('v', 'version').describe('v', 'Print the app versions.')
    .help('h').alias('h', 'help').describe('h', 'Print this help message.')
    .epilog('Created with <3 by Aluxian.')
    .argv;

  // Print the version and exit
  if (argv.version) {
    console.log(`${app.getName()} ${app.getVersion()}`);
    console.log(`Electron ${process.versions.electron}`);
    console.log(`Chromium ${process.versions.chrome}`);
    app.quit();
    return;
  }

  // Enable the crash reporter
  app.on('will-finish-launching', function() {
    CrashReporter.start(manifest.crashReporter);
  });

  // Check for update and create the main app object
  app.on('ready', function() {
    Updater.checkAndPrompt(manifest, false)
      .then(function(willUpdate) {
        if (willUpdate) {
          return app.quit();
        }

        global.application = new Application(manifest, argv);
      })
      .catch(::console.error);
  });
})();
