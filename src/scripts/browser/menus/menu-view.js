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
    platform: platform.isNonDarwin,
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
    label: 'Toggle Full Screen',
    accelerator: $.accelerator('Cmd+Ctrl+F', 'F11'),
    click: $.toggleFullScreen()
  }, {
    label: 'Toggle Developer Tools',
    accelerator: $.accelerator('Alt+Cmd+I', 'Alt+Ctrl+I'),
    click: $.toggleDevTools()
  }]
};
