import platform from 'common/utils/platform';
import $ from 'browser/menus/expressions';

export default {
  label: platform.isDarwin ? global.manifest.productName : '&App',
  submenu: [{
    label: 'About ' + global.manifest.productName,
    click: $.showCustomAboutDialog()
  }, {
    type: 'checkbox',
    label: 'Switch to Workplace Messenger',
    click: $.all(
      $.setPref('switch-workplace', $.key('checked')),
      $.reloadWindow()
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('switch-workplace'))
    )
  }, {
    label: platform.isDarwin ? 'Preferences...' : 'Settings',
    accelerator: 'CmdOrCtrl+,',
    click: $.sendToWebView('open-preferences-modal'),
    needsWindow: true
  }, {
    type: 'separator',
    allow: !global.options.mas
  }, {
    id: 'cfu-check-for-update',
    label: 'Check for &Update...',
    allow: !global.options.mas,
    click: $.cfuCheckForUpdate(true)
  }, {
    id: 'cfu-checking-for-update',
    label: 'Checking for &Update...',
    allow: !global.options.mas,
    enabled: false,
    visible: false
  }, {
    id: 'cfu-update-available',
    label: 'Download &Update...',
    allow: platform.isNonDarwin && (platform.isLinux || global.options.portable),
    visible: false,
    click: $.cfuUpdateAvailable()
  }, {
    id: 'cfu-update-available',
    label: 'Downloading &Update...',
    allow: !global.options.mas && !platform.isLinux && !global.options.portable,
    enabled: false,
    visible: false
  }, {
    id: 'cfu-update-downloaded',
    label: 'Restart and Install &Update...',
    allow: !global.options.mas,
    visible: false,
    click: $.cfuUpdateDownloaded()
  }, {
    label: 'Updates Release Channel',
    allow: !global.options.mas,
    submenu: ['Stable', 'Beta', 'Dev'].map((channelName) => ({
      type: 'radio',
      label: channelName,
      channel: channelName.toLowerCase(),
      click: $.all(
        $.setPref('updates-channel', $.key('channel')),
        $.resetAutoUpdaterUrl(),
        $.cfuCheckForUpdate(false)
      ),
      parse: $.all(
        $.setLocal('checked', $.eq($.pref('updates-channel'), $.key('channel')))
      )
    }))
  }, {
    type: 'checkbox',
    label: 'Check for Update Automatically',
    allow: !global.options.mas,
    click: $.all(
      $.checkForUpdateAuto($.key('checked')),
      $.setPref('updates-auto-check', $.key('checked'))
    ),
    parse: $.setLocal('checked', $.pref('updates-auto-check'))
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: '&Launch on OS Startup',
    allow: !global.options.mas && !global.options.portable,
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
    allow: !global.options.mas && !global.options.portable,
    click: $.setPref('launch-startup-hidden', $.key('checked')),
    parse: $.setLocal('checked', $.pref('launch-startup-hidden'))
  }, {
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
    label: 'Open Debug Log...',
    enabled: global.options.debug,
    click: $.openDebugLog()
  }, {
    type: 'separator'
  }, {
    label: '&Quit',
    accelerator: 'Ctrl+Q',
    allow: platform.isNonDarwin,
    click: $.appQuit()
  }, {
    role: 'services',
    submenu: [],
    allow: platform.isDarwin
  }, {
    type: 'separator',
    allow: platform.isDarwin
  }, {
    role: 'hide',
    allow: platform.isDarwin
  }, {
    role: 'hideothers',
    allow: platform.isDarwin
  }, {
    role: 'unhide',
    allow: platform.isDarwin
  }, {
    type: 'separator',
    allow: platform.isDarwin
  }, {
    role: 'quit',
    allow: platform.isDarwin
  }]
};
