import platform from '../utils/platform';
import $ from './expr';

export default {
  label: '&View',
  submenu: [{
    label: '&Reload Window',
    accelerator: 'Ctrl+R',
    platform: platform.isNonDarwin,
    click: $.reloadWindow()
  }, {
    label: 'Re&set Window',
    accelerator: 'Ctrl+Alt+R',
    platform: platform.isNonDarwin,
    click: $.all(
      $.resetWindow(),
      $.unsetPref('bounds')
    )
  }, {
    type: 'separator',
    platform: platform.isNonDarwin
  }, {
    type: 'checkbox',
    label: 'Float Window on &Top',
    accelerator: 'Ctrl+Shift+F',
    platform: platform.isNonDarwin,
    click: $.floatOnTop($.key('checked'))
  }, {
    type: 'checkbox',
    label: 'Open Links in &Browser',
    platform: platform.isNonDarwin,
    accelerator: 'Alt+Ctrl+B',
    click: $.all(
      $.setPref('links-in-browser', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('links-in-browser', $.val(true)))
    )
  }, {
    type: 'separator',
    platform: platform.isNonDarwin
  }, {
    label: 'Zoom In',
    accelerator: $.accelerator('Cmd+=', 'Ctrl+='),
    click: $.all(
      $.memoVal('zoom-level', $.sum($.pref('zoom-level', $.val(0)), $.val(1))),
      $.sendToWebContents('zoom-level', $.memoVal('zoom-level')),
      $.setPref('zoom-level', $.memoVal('zoom-level')),
      $.unmemoVal('zoom-level')
    )
  }, {
    label: 'Zoom Out',
    accelerator: $.accelerator('Cmd+-', 'Ctrl+-'),
    click: $.all(
      $.memoVal('zoom-level', $.sum($.pref('zoom-level', $.val(0)), $.val(-1))),
      $.sendToWebContents('zoom-level', $.memoVal('zoom-level')),
      $.setPref('zoom-level', $.memoVal('zoom-level')),
      $.unmemoVal('zoom-level')
    )
  }, {
    label: 'Reset Zoom',
    accelerator: $.accelerator('Cmd+0', 'Ctrl+0'),
    click: $.all(
      $.sendToWebContents('zoom-level', $.val(0)),
      $.unsetPref('zoom-level')
    )
  }, {
    type: 'separator'
  }, {
    label: 'Toggle &Full Screen',
    accelerator: $.accelerator('Cmd+Ctrl+F', 'F11'),
    click: $.toggleFullScreen()
  }, {
    label: 'Toggle &Developer Tools',
    accelerator: $.accelerator('Alt+Cmd+I', 'Alt+Ctrl+I'),
    click: $.toggleDevTools()
  }]
};
