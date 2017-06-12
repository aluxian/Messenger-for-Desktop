import prefs from 'browser/utils/prefs';
import $ from 'browser/menus/expressions';

export default [{
  id: 'show-tray',
  type: 'checkbox',
  label: 'Show in Menu Bar',
  allow: process.platform === 'darwin',
  checked: prefs.get('show-tray'),
  enabled: prefs.get('show-dock'),
  click: $.all(
    $.showInTray($.key('checked')),
    $.updateSibling('show-dock', 'enabled', $.key('checked')),
    $.updateMenuItem('main', 'show-tray')($.key('checked'))((checked) => $.all(
      $.setLocal('checked', $.val(checked)),
      $.updateSibling('show-dock', 'enabled', $.val(checked))
    )),
    $.setPref('show-tray', $.key('checked'))
  )
}, {
  id: 'show-dock',
  type: 'checkbox',
  label: 'Show in Dock',
  allow: process.platform === 'darwin',
  checked: prefs.get('show-dock'),
  enabled: prefs.get('show-tray'),
  click: $.all(
    $.showInDock($.key('checked')),
    $.updateSibling('show-tray', 'enabled', $.key('checked')),
    $.updateMenuItem('main', 'show-dock')($.key('checked'))((checked) => $.all(
      $.setLocal('checked', $.val(checked)),
      $.updateSibling('show-tray', 'enabled', $.val(checked))
    )),
    $.setPref('show-dock', $.key('checked'))
  )
}, {
  type: 'separator',
  allow: process.platform === 'darwin'
}, {
  label: 'Show ' + global.manifest.productName,
  click: $.showWindow()
}, {
  label: 'Quit ' + global.manifest.productName,
  click: $.appQuit()
}];
