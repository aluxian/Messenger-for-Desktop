import platform from 'common/utils/platform';
import $ from 'browser/menus/expressions';

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
    click: $.all(
      $.checkForUpdateAuto($.key('checked')),
      $.setPref('updates-auto-check', $.key('checked'))
    ),
    parse: $.setLocal('checked', $.pref('updates-auto-check'))
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
    label: '&Quit',
    accelerator: 'Ctrl+Q',
    click: $.appQuit()
  }]
};
