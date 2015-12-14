import $ from './expr';

export default {
  label: '&View',
  submenu: [{
    label: '&Reload',
    accelerator: $.accelerator('Cmd+R', 'Ctrl+R'),
    click: $.reloadWindow()
  }, {
    label: 'Re&set Window',
    accelerator: 'Ctrl+Alt+R',
    platform: $.isNonDarwin,
    click: $.all(
      $.resetWindow(),
      $.unsetPref('bounds')
    )
  }, {
    type: 'separator'
  }, {
    label: 'Zoom In',
    accelerator: $.accelerator('Cmd+Plus', 'Ctrl+Plus'),
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
    label: 'Developer Tools',
    accelerator: $.accelerator('Alt+Cmd+I', 'Alt+Ctrl+I'),
    click: $.toggleDevTools()
  }]
};
