import app from 'app';
import yargs from 'yargs';

import CrashReporter from 'crash-reporter';
import Application from './application';

import manifest from '../../package.json';

// Log uncaught exceptions
process.on('uncaughtException', (error) => console.error(error.stack));

// Define the CLI and parse arguments
const argv = yargs
  .usage('Usage: $0 [options]')
  .boolean('os-startup').describe('os-startup', 'Flag to indicate the app is being ran by the OS on startup.')
  .boolean('v').alias('v', 'version').describe('v', 'Print the app versions.')
  .help('h').alias('h', 'help').describe('h', 'Print this help message.')
  .epilog('Created with <3 by John Doe.')
  .argv;

// Print the version and exit
if (argv.version) {
  console.log(`${app.getName()} v${app.getVersion()}`);
  console.log(`Electron v${process.versions.electron}`);
  console.log(`Chromium v${process.versions.chrome}`);
  process.exit(0);
}

// Create the main Application object
app.on('ready', function() {
  global.application = new Application(manifest, argv);
});

// Enable the crash reporter
app.on('will-finish-launching', function() {
  CrashReporter.start(manifest.crashReporter);
});
