import manifest from '../../../../package.json';
import platform from '../../utils/platform';
import $ from '../expressions';

export default {
  label: manifest.productName,
  allow: platform.isDarwin,
  submenu: [{
    label: 'About ' + manifest.productName,
    role: 'about'
  }, {
    id: 'cfu-check-for-update',
    label: 'Check for Update',
    allow: !process.mas,
    click: $.cfuCheckForUpdate()
  }, {
    id: 'cfu-checking-for-update',
    label: 'Checking for Update...',
    allow: !process.mas,
    enabled: false,
    visible: false
  }, {
    id: 'cfu-update-available',
    label: 'Downloading Update...',
    allow: !process.mas,
    enabled: false,
    visible: false
  }, {
    id: 'cfu-update-downloaded',
    label: 'Restart and Install Update',
    allow: !process.mas,
    visible: false,
    click: $.cfuUpdateDownloaded()
  }, {
    type: 'checkbox',
    label: 'Report Stats and Errors',
    click: $.setPref('analytics-track', $.key('checked')),
    parse: $.setLocal('checked', $.pref('analytics-track'))
  }, {
    type: 'separator',
    allow: !process.mas
  }, {
    type: 'checkbox',
    label: 'Launch on Startup',
    allow: !process.mas,
    click: $.all(
      $.launchOnStartup($.key('checked')),
      $.updateSibling('startup-hidden', 'enabled', $.key('checked')),
      $.setPref('launch-startup', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('launch-startup')),
      $.updateSibling('startup-hidden', 'enabled', $.key('checked'))
    )
  }, {
    id: 'startup-hidden',
    type: 'checkbox',
    label: 'Start Hidden on Startup',
    allow: !process.mas,
    click: $.setPref('launch-startup-hidden', $.key('checked')),
    parse: $.setLocal('checked', $.pref('launch-startup-hidden'))
  }, {
    type: 'separator'
  }, {
    label: 'Services',
    role: 'services',
    submenu: []
  }, {
    type: 'separator'
  }, {
    label: 'Hide ' + manifest.productName,
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
