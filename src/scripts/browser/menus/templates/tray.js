import manifest from '../../../../package.json';
import $ from '../expressions';

export default [{
  id: 'show-tray',
  type: 'checkbox',
  label: 'Show in the Menu Bar',
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
  label: 'Show in the Dock',
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
  type: 'separator'
}, {
  label: 'Quit ' + manifest.productName,
  click: $.appQuit()
}];
