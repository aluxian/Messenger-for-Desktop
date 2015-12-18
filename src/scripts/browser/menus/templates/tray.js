import manifest from '../../../../package.json';
import $ from '../expressions';

export default [{
  id: 'show-tray',
  type: 'checkbox',
  label: 'Show in the Menu Bar',
  checked: true,
  click: $.all(
    $.showInTray($.key('checked')),
    $.setPref('show-tray', $.key('checked'))
  ),
  parse: $.all(
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
  checked: true,
  click: $.all(
    $.showInDock($.key('checked')),
    $.setPref('show-dock', $.key('checked'))
  ),
  parse: $.all(
    $.menu('main')(
      $.watchPref('show-tray', newValue => $.all(
        $.setLocal('checked', $.val(newValue)),
        $.updateSibling('show-dock', 'enabled', $.val(newValue))
      ))
    )
  )
}, {
  type: 'separator'
}, {
  label: 'Quit ' + manifest.productName,
  click: $.appQuit()
}];
