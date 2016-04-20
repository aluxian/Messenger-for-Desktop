import manifest from '../../../../package.json';
import platform from '../../utils/platform';
import $ from '../expressions';
import g from '../generator';

export default {
  label: '&App',
  allow: platform.isNonDarwin,
  submenu: [{
    label: 'Version ' + manifest.version + (manifest.versionChannel == 'stable' ? '' : '-' + manifest.versionChannel),
    enabled: false
  }, {
    id: 'cfu-check-for-update',
    label: 'Check for &Update',
    click: $.cfuCheckForUpdate()
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
    allow: !global.options.portable
  },
    g.appLaunchOnStartup(!global.options.portable),
    g.appLaunchHidden(!global.options.portable),
  {
    type: 'separator'
  }, {
    label: '&Quit',
    accelerator: 'Ctrl+Q',
    click: $.appQuit()
  }]
};
