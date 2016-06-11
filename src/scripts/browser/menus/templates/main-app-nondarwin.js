import platform from 'common/utils/platform';
import prefs from 'browser/utils/prefs';
import $ from 'browser/menus/expressions';
import g from 'browser/menus/generator';

const updatesChannel = prefs.get('updates-channel');
const allowAutoLaunch = !global.options.portable && (!platform.isLinux || updatesChannel === 'dev');

let versionSuffix = '';
if (global.manifest.versionChannel !== 'stable') {
  versionSuffix = '-' + global.manifest.versionChannel;
}

export default {
  label: '&App',
  allow: platform.isNonDarwin,
  submenu: [{
    label: 'Version ' + global.manifest.version + versionSuffix,
    enabled: false
  }, {
    id: 'cfu-check-for-update',
    label: 'Check for &Update',
    click: $.cfuCheckForUpdate(true)
  }, {
    id: 'cfu-checking-for-update',
    label: 'Checking for &Update...',
    enabled: false,
    visible: false
  }, {
    id: 'cfu-update-available',
    label: 'Download &Update',
    allow: platform.isLinux || global.options.portable,
    visible: false,
    click: $.cfuUpdateAvailable()
  }, {
    id: 'cfu-update-available',
    label: 'Downloading &Update...',
    allow: !platform.isLinux && !global.options.portable,
    enabled: false,
    visible: false
  }, {
    id: 'cfu-update-downloaded',
    label: 'Restart and Install &Update',
    visible: false,
    click: $.cfuUpdateDownloaded()
  },
    g.separator(),
    g.appUpdatesReleaseChannel(),
  {
    type: 'checkbox',
    label: 'Check for Update Automatically',
    click: $.all(
      $.checkForUpdateAuto($.key('checked')),
      $.setPref('updates-auto-check', $.key('checked'))
    ),
    parse: $.setLocal('checked', $.pref('updates-auto-check'))
  }, {
    type: 'checkbox',
    label: '&Report Stats and Crashes',
    click: $.setPref('analytics-track', $.key('checked')),
    parse: $.setLocal('checked', $.pref('analytics-track'))
  }, {
    type: 'separator',
    allow: allowAutoLaunch
  },
    g.appLaunchOnStartup(allowAutoLaunch),
    g.appLaunchHidden(allowAutoLaunch),
  {
    type: 'separator'
  }, {
    label: 'Restart in Debug Mode',
    allow: !global.options.debug,
    click: $.restartInDebugMode()
  }, {
    label: 'Running in Debug Mode',
    allow: global.options.debug,
    enabled: false
  }, {
    label: 'Open Debug Log',
    enabled: global.options.debug,
    click: $.openDebugLog()
  }, {
    type: 'separator'
  }, {
    label: '&Quit',
    accelerator: 'Ctrl+Q',
    click: $.appQuit()
  }]
};
