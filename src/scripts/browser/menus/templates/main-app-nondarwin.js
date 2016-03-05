import manifest from '../../../../package.json';
import platform from '../../utils/platform';
import $ from '../expressions';

export default {
  label: '&App',
  allow: platform.isNonDarwin,
  submenu: [{
    label: 'Version ' + manifest.version,
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
  }, {
    type: 'checkbox',
    label: '&Report Stats and Errors',
    click: $.all(
      $.setPref('analytics-track', $.key('checked')),
      $.reloadWindow()
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('analytics-track'))
    )
  }, {
    type: 'separator',
    allow: !global.options.portable
  }, {
    type: 'checkbox',
    label: '&Launch on Startup',
    allow: !global.options.portable,
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
    label: 'Start &Hidden on Startup',
    allow: !global.options.portable,
    click: $.all(
      $.setPref('launch-startup-hidden', $.key('checked')),
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('launch-startup-hidden'))
    )
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: 'Check &Spelling While Typing',
    click: $.all(
      $.sendToWebView('spell-checker', $.key('checked'), $.pref('spell-checker-auto-correct')),
      $.updateSibling('spell-checker-auto-correct', 'enabled', $.key('checked')),
      $.setPref('spell-checker', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('spell-checker')),
      $.updateSibling('spell-checker-auto-correct', 'enabled', $.key('checked'))
    )
  }, {
    id: 'spell-checker-auto-correct',
    type: 'checkbox',
    label: '&Auto Correct Spelling Mistakes',
    click: $.all(
      $.sendToWebView('spell-checker', $.pref('spell-checker'), $.key('checked')),
      $.setPref('spell-checker-auto-correct', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('spell-checker-auto-correct'))
    )
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: '&Float on Top',
    accelerator: 'Ctrl+Shift+F',
    click: $.floatOnTop($.key('checked'))
  }, {
    type: 'checkbox',
    label: 'Show in &Tray',
    click: $.all(
      $.showInTray($.key('checked')),
      $.setPref('show-tray', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('show-tray')),
    )
  }, {
    type: 'checkbox',
    label: 'Open Links in &Browser',
    click: $.all(
      $.setPref('links-in-browser', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('links-in-browser'))
    )
  }, {
    type: 'separator'
  }, {
    label: '&Quit',
    accelerator: 'Alt+F4',
    click: $.appQuit()
  }]
};
