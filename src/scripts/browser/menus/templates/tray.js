import platform from 'common/utils/platform';
import $ from 'browser/menus/expressions';

export default [{
  label: 'Reset Window',
  click: $.resetWindow()
}, {
  type: 'separator'
}, {
  id: 'show-tray',
  type: 'checkbox',
  label: 'Show in Menu Bar',
  allow: platform.isDarwin,
  checked: true,
  click: $.all(
    $.showInTray($.key('checked')),
    $.updateSibling('show-dock', 'enabled', $.key('checked')),
    $.updateMenuItem('main', 'show-tray')($.key('checked'))(checked => $.all(
      $.setLocal('checked', $.val(checked)),
      $.updateSibling('show-dock', 'enabled', $.val(checked))
    )),
    $.setPref('show-tray', $.key('checked'))
  )
}, {
  id: 'show-dock',
  type: 'checkbox',
  label: 'Show in Dock',
  allow: platform.isDarwin,
  checked: true,
  click: $.all(
    $.showInDock($.key('checked')),
    $.updateSibling('show-tray', 'enabled', $.key('checked')),
    $.updateMenuItem('main', 'show-dock')($.key('checked'))(checked => $.all(
      $.setLocal('checked', $.val(checked)),
      $.updateSibling('show-tray', 'enabled', $.val(checked))
    )),
    $.setPref('show-dock', $.key('checked'))
  )
}, {
  type: 'separator',
  allow: platform.isDarwin
}, {
  label: 'Show ' + global.manifest.productName,
  click: $.showWindow()
}, {
  label: 'Quit ' + global.manifest.productName,
  click: $.appQuit()
}];
