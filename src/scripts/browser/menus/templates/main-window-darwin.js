import platform from 'common/utils/platform';
import $ from 'browser/menus/expressions';

export default {
  label: 'Window',
  allow: platform.isDarwin,
  role: 'window',
  submenu: [{
    label: 'Reload',
    accelerator: 'Cmd+R',
    needsWindow: true,
    click: $.reloadWindow()
  }, {
    label: 'Reset',
    accelerator: 'Cmd+Alt+R',
    needsWindow: true,
    click: $.resetWindow()
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: 'Float on Top',
    accelerator: 'Cmd+Alt+T',
    needsWindow: true,
    click: $.floatOnTop($.key('checked'))
  }, {
    type: 'checkbox',
    label: 'Close with Escape Key',
    click: $.setPref('close-with-esc', $.key('checked')),
    parse: $.setLocal('checked', $.pref('close-with-esc'))
  }, {
    type: 'checkbox',
    label: 'Open Links in Browser',
    click: $.setPref('links-in-browser', $.key('checked')),
    parse: $.setLocal('checked', $.pref('links-in-browser'))
  }, {
    type: 'checkbox',
    label: 'Notifications Badge in Dock',
    click: $.all(
      $.setPref('show-notifications-badge', $.key('checked')),
      $.hideDockBadge($.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('show-notifications-badge'))
    )
  }, {
    type: 'separator'
  }, {
    id: 'show-tray',
    type: 'checkbox',
    label: 'Show in Menu Bar',
    click: $.all(
      $.showInTray($.key('checked')),
      $.updateSibling('show-dock', 'enabled', $.key('checked')),
      $.updateMenuItem('tray', 'show-tray')($.key('checked'))((checked) => $.all(
        $.setLocal('checked', $.val(checked)),
        $.updateSibling('show-dock', 'enabled', $.val(checked))
      )),
      $.setPref('show-tray', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('show-tray')),
      $.updateSibling('show-dock', 'enabled', $.key('checked'))
    )
  }, {
    id: 'show-dock',
    type: 'checkbox',
    label: 'Show in Dock',
    click: $.all(
      $.showInDock($.key('checked')),
      $.updateSibling('show-tray', 'enabled', $.key('checked')),
      $.updateMenuItem('tray', 'show-dock')($.key('checked'))((checked) => $.all(
        $.setLocal('checked', $.val(checked)),
        $.updateSibling('show-tray', 'enabled', $.val(checked))
      )),
      $.setPref('show-dock', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('show-dock')),
      $.updateSibling('show-tray', 'enabled', $.key('checked')),
      $.showInDock($.key('checked'))
    )
  }, {
    type: 'separator'
  }, {
    role: 'minimize'
  }, {
    role: 'zoom'
  }, {
    role: 'close'
  }]
};
