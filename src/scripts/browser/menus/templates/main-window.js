import platform from '../../utils/platform';
import $ from '../expressions';

export default {
  label: 'Window',
  platform: platform.isDarwin,
  role: 'window',
  submenu: [{
    label: 'Reload',
    accelerator: 'Cmd+R',
    click: $.reloadWindow()
  }, {
    label: 'Reset',
    accelerator: 'Cmd+Alt+R',
    click: $.all(
      $.resetWindow(),
      $.unsetPref('bounds')
    )
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: 'Float on Top',
    accelerator: 'Cmd+Ctrl+F',
    click: $.floatOnTop($.key('checked'))
  }, {
    type: 'checkbox',
    label: 'Open Links in Browser',
    click: $.all(
      $.setPref('links-in-browser', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('links-in-browser', $.val(true)))
    )
  }, {
    type: 'separator'
  }, {
    id: 'show-tray',
    type: 'checkbox',
    label: 'Show in the Menu Bar',
    accelerator: 'Cmd+Shift+M',
    click: $.all(
      $.showInTray($.key('checked')),
      $.setPref('show-tray', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('show-tray', $.val(false))),
      $.updateSibling('show-dock', 'enabled', $.key('checked')),
      $.menu('main')(
        $.watchPref('show-tray', newValue => $.all(
          $.setLocal('checked', $.val(newValue)),
          $.updateSibling('show-dock', 'enabled', $.val(newValue))
        ))
      )
    )
  }, {
    id: 'show-dock',
    type: 'checkbox',
    label: 'Show in the Dock',
    accelerator: 'Cmd+Shift+D',
    click: $.all(
      $.showInDock($.key('checked')),
      $.setPref('show-dock', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('show-dock', $.val(true))),
      $.updateSibling('show-tray', 'enabled', $.key('checked')),
      $.showInDock($.key('checked')),
      $.menu('main')(
        $.watchPref('show-dock', newValue => $.all(
          $.setLocal('checked', $.val(newValue)),
          $.updateSibling('show-tray', 'enabled', $.val(newValue))
        ))
      )
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
