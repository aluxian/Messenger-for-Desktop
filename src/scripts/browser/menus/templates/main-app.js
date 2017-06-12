import {app, shell, dialog} from 'electron';

import prefs from 'browser/utils/prefs';
import filePaths from 'common/utils/file-paths';

export default {
  label: process.platform === 'darwin' ? global.manifest.productName : 'App',
  submenu: [{
    role: 'about',
    click () {
      dialog.showMessageBox({
        icon: filePaths.getImagePath('app_icon.png'),
        title: 'About ' + global.manifest.productName,
        message: global.manifest.productName + ' v' + global.manifest.version + '-' + global.manifest.versionChannel,
        detail: global.manifest.copyright + '\n\n' + 'Special thanks to @sytten, @nevercast' +
          ', @TheHimanshu, @MichaelAquilina, @franciscoib, @levrik, and all the contributors on GitHub.'
      });
    }
  }, {
    type: 'checkbox',
    label: 'Switch to Workplace Messenger',
    checked: prefs.get('switch-workplace'),
    click (menuItem, browserWindow) {
      prefs.set('switch-workplace', menuItem.checked);
      browserWindow.webContents.reloadIgnoringCache();
    }
  }, {
    label: process.platform === 'darwin' ? 'Preferences...' : 'Settings',
    accelerator: 'CmdOrCtrl+,',
    click (menuItem, browserWindow) {
      browserWindow.webContents.send('fwd-webview', 'open-preferences-modal');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Check for Update...',
    click () {
      global.application.autoUpdateManager.handleMenuCheckForUpdate(true);
    }
  }, {
    label: 'Checking for Update...',
    enabled: false,
    visible: false
  }, {
    label: 'Download Update...',
    visible: false,
    click () {
      global.application.autoUpdateManager.handleMenuUpdateAvailable();
    }
  }, {
    label: 'Downloading Update...',
    enabled: false,
    visible: false
  }, {
    label: 'Restart and Install Update...',
    visible: false,
    click () {
      global.application.autoUpdateManager.handleMenuUpdateDownloaded();
    }
  }, {
    label: 'Updates Release Channel',
    submenu: ['Stable', 'Beta', 'Dev'].map((channelName) => ({
      type: 'radio',
      label: channelName,
      checked: prefs.get('updates-channel') === channelName.toLowerCase(),
      click () {
        prefs.set('updates-channel', channelName.toLowerCase());
        global.application.autoUpdateManager.initFeedUrl();
        global.application.autoUpdateManager.handleMenuCheckForUpdate(false);
      }
    }))
  }, {
    type: 'checkbox',
    label: 'Check for Update Automatically',
    checked: prefs.get('updates-auto-check'),
    click (menuItem) {
      global.application.autoUpdateManager.setAutoCheck(menuItem.checked);
      prefs.set('updates-auto-check', menuItem.checked);
    }
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: 'Launch on OS Startup',
    visible: !global.options.portable,
    checked: prefs.get('launch-startup'),
    click (menuItem, browserWindow) {
      if (menuItem.checked) {
        global.application.autoLauncher.enable()
          .then(() => log('auto launcher enabled'))
          .catch((err) => {
            log('could not enable auto-launcher');
            logError(err, true);
          });
      } else {
        global.application.autoLauncher.disable()
          .then(() => log('auto launcher disabled'))
          .catch((err) => {
            log('could not disable auto-launcher');
            logError(err, true);
          });
      }
      menuItem.menu.items.find(e => e.label === 'Start Hidden on Startup').enabled = menuItem.checked;
      prefs.set('launch-startup', menuItem.checked);
    }
  }, {
    type: 'checkbox',
    label: 'Start Hidden on Startup',
    visible: !global.options.portable,
    checked: prefs.get('launch-startup-hidden'),
    enabled: prefs.get('launch-startup'),
    click (menuItem) {
      prefs.set('launch-startup-hidden', menuItem.checked);
    }
  }, {
    type: 'separator'
  }, {
    label: 'Restart in Debug Mode',
    visible: !global.options.debug,
    click () {
      const options = {
        // without --no-console-logs, calls to console.log et al. trigger EBADF errors in the new process
        args: [...process.argv.slice(1), '--debug', '--no-console-logs']
      };

      log('relaunching app', JSON.stringify(options));
      app.relaunch(options);
      app.exit();
    }
  }, {
    label: 'Running in Debug Mode',
    visible: global.options.debug,
    enabled: false
  }, {
    label: 'Open Debug Log...',
    enabled: global.options.debug,
    click () {
      if (global.__debug_file_log_path) {
        log('opening log file with default app', global.__debug_file_log_path);
        shell.openItem(global.__debug_file_log_path);
      } else {
        logError(new Error('global.__debug_file_log_path was falsy'));
      }
    }
  }, {
    type: 'separator',
    visible: process.platform === 'darwin'
  }, {
    role: 'services',
    submenu: [],
    visible: process.platform === 'darwin'
  }, {
    type: 'separator',
    visible: process.platform === 'darwin'
  }, {
    role: 'hide',
    visible: process.platform === 'darwin'
  }, {
    role: 'hideothers',
    visible: process.platform === 'darwin'
  }, {
    role: 'unhide',
    visible: process.platform === 'darwin'
  }, {
    type: 'separator',
    visible: process.platform === 'darwin'
  }, {
    role: 'quit'
  }]
};
