import platform from 'common/utils/platform';
import $ from 'browser/menus/expressions';

export default {
  label: global.manifest.productName,
  allow: platform.isDarwin,
  submenu: [{
    role: 'about'
  }, {
    id: 'cfu-check-for-update',
    label: 'Check for Update',
    allow: !global.options.mas,
    click: $.cfuCheckForUpdate(true)
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
  }, {
    type: 'separator'
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
    type: 'separator',
    allow: !global.options.mas
  }, {
    type: 'checkbox',
    label: '&Launch on Startup',
    allow: !global.options.mas,
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
    allow: !global.options.mas,
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
    label: 'Open Debug Log',
    enabled: global.options.debug,
    click: $.openDebugLog()
  }, {
    type: 'separator'
  }, {
    role: 'services',
    submenu: []
  }, {
    type: 'separator'
  }, {
    role: 'hide'
  }, {
    role: 'hideothers'
  }, {
    role: 'unhide'
  }, {
    type: 'separator'
  }, {
    role: 'quit'
  }]
};
