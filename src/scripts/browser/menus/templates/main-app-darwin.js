import platform from 'common/utils/platform';
import $ from 'browser/menus/expressions';
import g from 'browser/menus/generator';

export default {
  label: global.manifest.productName,
  allow: platform.isDarwin,
  submenu: [{
    label: 'About ' + global.manifest.productName,
    role: 'about'
  }, {
    id: 'cfu-check-for-update',
    label: 'Check for Update',
    allow: !global.options.mas,
    click: $.cfuCheckForUpdate()
  }, {
    id: 'cfu-checking-for-update',
    label: 'Checking for Update...',
    allow: !global.options.mas,
    enabled: false,
    visible: false
  }, {
    id: 'cfu-update-available',
    label: 'Downloading Update...',
    allow: !global.options.mas,
    enabled: false,
    visible: false
  }, {
    id: 'cfu-update-downloaded',
    label: 'Restart and Install Update',
    allow: !global.options.mas,
    visible: false,
    click: $.cfuUpdateDownloaded()
  },
    g.separator(),
    g.appUpdatesReleaseChannel(),
  {
    type: 'checkbox',
    label: 'Check for Update Automatically',
    allow: !global.options.mas,
    click: $.all(
      $.checkForUpdateAuto($.key('checked')),
      $.setPref('updates-auto-check', $.key('checked'))
    ),
    parse: $.setLocal('checked', $.pref('updates-auto-check'))
  }, {
    type: 'checkbox',
    label: 'Report Stats and Crashes',
    click: $.setPref('analytics-track', $.key('checked')),
    parse: $.setLocal('checked', $.pref('analytics-track'))
  }, {
    type: 'separator',
    allow: !global.options.mas
  },
    g.appLaunchOnStartup(!global.options.mas),
    g.appLaunchHidden(!global.options.mas),
  {
    type: 'separator'
  }, {
    label: 'Services',
    role: 'services',
    submenu: []
  }, {
    type: 'separator'
  }, {
    label: 'Hide ' + global.manifest.productName,
    accelerator: 'Cmd+H',
    role: 'hide'
  }, {
    label: 'Hide Others',
    accelerator: 'Cmd+Shift+H',
    role: 'hideothers'
  }, {
    label: 'Show All',
    role: 'unhide'
  }, {
    type: 'separator'
  }, {
    label: 'Quit',
    accelerator: 'Cmd+Q',
    click: $.appQuit()
  }]
};
