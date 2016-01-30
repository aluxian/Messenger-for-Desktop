import platform from '../../utils/platform';
import $ from '../expressions';

export default {
  label: 'Window',
  allow: platform.isDarwin,
  role: 'window',
  submenu: [{
    label: 'Reload',
    accelerator: 'Cmd+R',
    click: $.reloadWindow()
  }, {
    label: 'Reset',
    accelerator: 'Cmd+Alt+R',
    click: $.all(
      $.resetWindow()
    )
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: 'Float on Top',
    click: $.floatOnTop($.key('checked'))
  }, {
    type: 'checkbox',
    label: 'Open Links in Browser',
    click: $.all(
      $.setPref('links-in-browser', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('links-in-browser'))
    )
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
    label: 'Show in the Menu Bar',
    click: $.all(
      $.showInTray($.key('checked')),
      $.updateSibling('show-dock', 'enabled', $.key('checked')),
      $.updateMenuItem('tray', 'show-tray')($.key('checked'))(checked => $.all(
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
    label: 'Show in the Dock',
    click: $.all(
      $.showInDock($.key('checked')),
      $.updateSibling('show-tray', 'enabled', $.key('checked')),
      $.updateMenuItem('tray', 'show-dock')($.key('checked'))(checked => $.all(
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
    label: 'Minimize',
    accelerator: 'Cmd+M',
    role: 'minimize'
  }, {
    label: 'Zoom',
    accelerator: 'Alt+Cmd+Ctrl+M',
    selector: 'zoom:'
  }, {
    label: 'Close',
    accelerator: 'Cmd+W',
    role: 'close'
  }]
};
