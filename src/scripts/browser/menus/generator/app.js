import $ from 'browser/menus/expressions';

export function appLaunchOnStartup (allow) {
  return {
    type: 'checkbox',
    label: '&Launch on Startup',
    allow,
    click: $.all(
      $.launchOnStartup($.key('checked')),
      $.updateSibling('startup-hidden', 'enabled', $.key('checked')),
      $.setPref('launch-startup', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('launch-startup')),
      $.updateSibling('startup-hidden', 'enabled', $.key('checked'))
    )
  };
}

export function appLaunchHidden (allow) {
  return {
    id: 'startup-hidden',
    type: 'checkbox',
    label: 'Start &Hidden on Startup',
    allow,
    click: $.setPref('launch-startup-hidden', $.key('checked')),
    parse: $.setLocal('checked', $.pref('launch-startup-hidden'))
  };
}

export function appUpdatesReleaseChannel () {
  return {
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
  };
}
