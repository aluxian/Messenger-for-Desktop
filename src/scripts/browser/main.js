import filePaths from './utils/file-paths';
import dialog from 'dialog';
import yargs from 'yargs';
import path from 'path';
import app from 'app';

import CrashReporter from 'crash-reporter';
import SquirrelEvents from './components/squirrel-events';
import Application from './application';

import manifest from '../../package.json';

// Handle uncaught exceptions
process.on('uncaughtException', function(ex) {
  const isSignatureEx = ex.message == 'Could not get code signature for running application';
  const isDevRelease = manifest.distrib == 'unset';
  if (isDevRelease && isSignatureEx) {
    logFatal('uncaught exception', ex.message);
  } else {
    dialog.showErrorBox('JavaScript error in the main process', ex.stack);
  }
});

(function() {
  // Define the CLI arguments and parse them
  const argv = yargs
    .usage('Usage: $0 [options]')
    .option('os-startup', {
      type: 'boolean',
      description: 'Flag to indicate the app is being ran by the OS on startup.'
    })
    .option('portable', {
      type: 'boolean',
      description: 'Run in portable mode.'
    })
    .option('version', {
      type: 'boolean',
      description: 'Print the app version.',
      alias: 'v'
    })
    .option('squirrel-install', {
      type: 'string',
      description: 'Squirrel.Windows flag, called when the app is installed.'
    })
    .option('squirrel-uninstall', {
      type: 'string',
      description: 'Squirrel.Windows flag, called after the app is updated.'
    })
    .option('squirrel-updated', {
      type: 'string',
      description: 'Squirrel.Windows flag, called when the app is uninstalled.'
    })
    .option('squirrel-obsolete', {
      type: 'string',
      description: 'Squirrel.Windows flag, called before updating to a new version.'
    })
    .option('squirrel-firstrun', {
      type: 'boolean',
      description: 'Squirrel.Windows flag, called only once after installation.'
    })
    .help('help', 'Print this help message.').alias('help', 'h')
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
    const userDataPath = path.join(filePaths.getAppDir(), 'data');
    log('set userData path', userDataPath);
    app.setPath('userData', userDataPath);
  }

  // Enable the crash reporter
  if (!process.mas) {
    app.on('will-finish-launching', function() {
      log('will finish launching');

      // Crash reporter
      const reporterOptions = {
        productName: manifest.productName,
        companyName: manifest.win.companyName,
        submitURL: manifest.crashReporter.url,
        autoSubmit: true
      };

      log('starting crash reporter', reporterOptions);
      CrashReporter.start(reporterOptions);
    });
  } else {
    log('mas release');
  }

  // Create the main app object and init
  app.on('ready', function() {
    log('ready, launching app');
    global.manifest = manifest;
    global.application = new Application(manifest, argv);
    global.application.init();
  });
})();
