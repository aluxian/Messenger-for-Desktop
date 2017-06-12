import {app, shell} from 'electron';

import prefs from 'browser/utils/prefs';
import $ from 'browser/menus/expressions';

export default {
  label: process.platform === 'darwin' ? global.manifest.productName : 'App',
  submenu: [{
    role: 'about',
    click: $.showCustomAboutDialog()
  }, {
    type: 'checkbox',
    label: 'Switch to Workplace Messenger',
    checked: prefs.get('switch-workplace'),
    click: $.all(
      $.setPref('switch-workplace', $.key('checked')),
      $.reloadWindow()
    )
  }, {
    label: process.platform === 'darwin' ? 'Preferences...' : 'Settings',
    accelerator: 'CmdOrCtrl+,',
    click: $.sendToWebView('open-preferences-modal'),
    needsWindow: true
  }, {
    type: 'separator'
  }, {
    id: 'cfu-check-for-update',
    label: 'Check for Update...',
    click: $.cfuCheckForUpdate(true)
  }, {
    id: 'cfu-checking-for-update',
    label: 'Checking for Update...',
    enabled: false,
    visible: false
  }, {
    id: 'cfu-update-available',
    label: 'Download Update...',
    allow: process.platform !== 'darwin' && (process.platform === 'linux' || global.options.portable),
    visible: false,
    click: $.cfuUpdateAvailable()
  }, {
    id: 'cfu-update-available',
    label: 'Downloading Update...',
    allow: !process.platform === 'linux' && !global.options.portable,
    enabled: false,
    visible: false
  }, {
    id: 'cfu-update-downloaded',
    label: 'Restart and Install Update...',
    visible: false,
    click: $.cfuUpdateDownloaded()
  }, {
    label: 'Updates Release Channel',
    submenu: ['Stable', 'Beta', 'Dev'].map((channelName) => ({
      type: 'radio',
      label: channelName,
      checked: prefs.get('updates-channel') === channelName.toLowerCase(),
      click: $.all(
        $.setPref('updates-channel', channelName.toLowerCase()),
        $.resetAutoUpdaterUrl(),
        $.cfuCheckForUpdate(false)
      )
    }))
  }, {
    type: 'checkbox',
    label: 'Check for Update Automatically',
    checked: prefs.get('updates-auto-check'),
    click: $.all(
      $.checkForUpdateAuto($.key('checked')),
      $.setPref('updates-auto-check', $.key('checked'))
    )
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: 'Launch on OS Startup',
    allow: !global.options.portable,
    checked: prefs.get('launch-startup'),
    click: $.all(
      $.launchOnStartup($.key('checked')),
      $.updateSibling('startup-hidden', 'enabled', $.key('checked')),
      $.setPref('launch-startup', $.key('checked'))
    ),
    parse: $.all(
      $.updateSibling('startup-hidden', 'enabled', $.key('checked'))
    )
  }, {
    id: 'startup-hidden',
    type: 'checkbox',
    label: 'Start Hidden on Startup',
    allow: !global.options.portable,
    checked: prefs.get('launch-startup-hidden'),
    click: $.setPref('launch-startup-hidden', $.key('checked'))
  }, {
    type: 'separator'
  }, {
    label: 'Restart in Debug Mode',
    allow: !global.options.debug,
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
    allow: global.options.debug,
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
    allow: process.platform === 'darwin'
  }, {
    role: 'services',
    submenu: [],
    allow: process.platform === 'darwin'
  }, {
    type: 'separator',
    allow: process.platform === 'darwin'
  }, {
    role: 'hide',
    allow: process.platform === 'darwin'
  }, {
    role: 'hideothers',
    allow: process.platform === 'darwin'
  }, {
    role: 'unhide',
    allow: process.platform === 'darwin'
  }, {
    type: 'separator',
    allow: process.platform === 'darwin'
  }, {
    role: 'quit'
  }]
};
