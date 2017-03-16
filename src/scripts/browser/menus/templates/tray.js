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
  click: $.all(
    $.showInTray($.key('checked')),
    $.updateSibling('show-dock', 'enabled', $.key('checked')),
    $.updateMenuItem('main', 'show-tray')($.key('checked'))((checked) => $.all(
      $.setLocal('checked', $.val(checked)),
      $.updateSibling('show-dock', 'enabled', $.val(checked))
    )),
    $.setPref('show-tray', $.key('checked'))
  ),
  parse: $.all(
    $.setLocal('checked', $.pref('show-tray')),
    $.setLocal('enabled', $.pref('show-dock'))
  )
}, {
  id: 'show-dock',
  type: 'checkbox',
  label: 'Show in Dock',
  allow: platform.isDarwin,
  click: $.all(
    $.showInDock($.key('checked')),
    $.updateSibling('show-tray', 'enabled', $.key('checked')),
    $.updateMenuItem('main', 'show-dock')($.key('checked'))((checked) => $.all(
      $.setLocal('checked', $.val(checked)),
      $.updateSibling('show-tray', 'enabled', $.val(checked))
    )),
    $.setPref('show-dock', $.key('checked'))
  ),
  parse: $.all(
    $.setLocal('checked', $.pref('show-dock')),
    $.setLocal('enabled', $.pref('show-tray'))
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
