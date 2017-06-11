import {app, dialog, session, screen} from 'electron';
import yargs from 'yargs';

import prefs from 'browser/utils/prefs';
import filePaths from 'common/utils/file-paths';
import platform from 'common/utils/platform';

// Handle uncaught exceptions
process.on('uncaughtException', function (err) {
  dialog.showErrorBox('JavaScript error in the main process', err.stack);
  logFatal(err);
});

// Handle promise rejections
process.on('unhandledRejection', function (err) {
  log('unhandled promise rejection');
  logFatal(err);
});

// Define the CLI arguments and parse them
const cliArgs = process.argv.slice(1);
const options = yargs(cliArgs)
  .usage('Usage: $0 [options]')
  .option('os-startup', {
    type: 'boolean',
    description: 'Flag to indicate the app is being run by the OS on startup.'
  })
  .option('portable', {
    type: 'boolean',
    description: 'Run in portable mode.'
  })
  .option('debug', {
    type: 'boolean',
    description: 'Run in debug mode.'
  })
  .option('console-logs', {
    type: 'boolean',
    description: 'Allow usage of console.log and friends.',
    default: true
  })
  .option('mas', {
    type: 'boolean',
    description: 'Run in Mac App Store release mode.'
  })
  .option('version', {
    type: 'boolean',
    description: 'Print the app version.',
    alias: 'v'
  })
  .option('squirrel-install', {
    type: 'boolean',
    description: 'Squirrel.Windows flag, called when the app is installed.'
  })
  .option('squirrel-uninstall', {
    type: 'boolean',
    description: 'Squirrel.Windows flag, called after the app is updated.'
  })
  .option('squirrel-updated', {
    type: 'boolean',
    description: 'Squirrel.Windows flag, called when the app is uninstalled.'
  })
  .option('squirrel-obsolete', {
    type: 'boolean',
    description: 'Squirrel.Windows flag, called before updating to a new version.'
  })
  .option('squirrel-firstrun', {
    type: 'boolean',
    description: 'Squirrel.Windows flag, called only once after installation.'
  })
  .help('help', 'Print this help message.').alias('help', 'h')
  .epilog('Coded with <3 by ' + global.manifest.author)
  .argv;

options.mas = options.mas || !!process.mas;
options.portable = options.portable || !!global.manifest.portable;
options.debug = options.debug || !!process.env.DEBUG;
global.options = options;

// Log args
log('cli args parsed', JSON.stringify(options));

// Check for debug mode
if (options.debug) {
  log('running in debug mode');
}

// Check for mas mode
if (options.mas) {
  log('running in mas mode');
}

// Change the userData path if in portable mode
if (options.portable) {
  log('running in portable mode');
  const userDataPath = filePaths.getCustomUserDataPath();
  log('setting userData path', userDataPath);
  app.setPath('userData', userDataPath);
}

(() => {
  if (checkSquirrelWindowsArgs()) return;
  if (quitIfPrefEnabled()) return;
  if (printVersionsAndExit()) return;
  if (enforceSingleInstance()) return;
  preReadySetup();
  initAndLaunch().catch((err) => {
    log('init and launch failed');
    logFatal(err);
  });
})();

function checkSquirrelWindowsArgs () {
  if (platform.isWindows) {
    const SquirrelEvents = require('browser/components/squirrel-events').default;
    if (SquirrelEvents.check(options)) {
      log('Squirrel.Windows event detected');
      return true;
    }
  }
  return false;
}

function quitIfPrefEnabled () {
  if (prefs.get('launch-quit')) {
    log('launch-quit pref is true, quitting');
    prefs.unsetSync('launch-quit');
    app.quit();
    return true;
  }
  return false;
}

function printVersionsAndExit () {
  if (options.version) {
    console.log(`${app.getName()} ${app.getVersion()} (${global.manifest.buildNum})`);
    console.log(`Electron ${process.versions.electron}`);
    console.log(`Chromium ${process.versions.chrome}`);
    app.quit();
    return true;
  }
  return false;
}

function enforceSingleInstance () {
  const isDuplicateInstance = app.makeSingleInstance((argv, cwd) => {
    log('another instance tried to run argv:', argv, 'cwd:', cwd);
    if (global.application) {
      global.application.mainWindowManager.showOrCreate();
    }
  });

  if (isDuplicateInstance) {
    console.log('Another instance of ' + global.manifest.productName + ' is already running.');
    app.quit();
    return true;
  }

  return false;
}

function preReadySetup () {
  app.disableHardwareAcceleration(); // should be easier on the GPU
}

async function initAndLaunch () {
  try {
    await onAppReady();
    enableHighResResources();
  } catch (err) {
    logFatal(err);
    return;
  }

  log('launching app');
  const Application = require('browser/application').default;
  global.application = new Application();
  global.application.init();
  global.ready = true;
}

function onAppReady () {
  return new Promise((resolve, reject) => {
    app.on('ready', () => {
      log('ready');
      resolve();
    });
  });
}

/**
 * @source https://github.com/sindresorhus/caprine/pull/172
 */
function enableHighResResources () {
  const scaleFactor = Math.max.apply(null, screen.getAllDisplays().map(scr => scr.scaleFactor));
  if (scaleFactor === 1) {
    return;
  }

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    let cookie = details.requestHeaders.Cookie;
    if (cookie && details.method === 'GET' && details.url.startsWith('https://www.messenger.com/')) {
      if (cookie.match(/(; )?dpr=\d/)) {
        cookie = cookie.replace(/dpr=\d/, 'dpr=' + scaleFactor);
      } else {
        cookie = cookie + '; dpr=' + scaleFactor;
      }
      details.requestHeaders.Cookie = cookie;
    }
    callback({cancel: false, requestHeaders: details.requestHeaders});
  });
}
