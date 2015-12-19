import platform from '../../utils/platform';
import {P} from './utils';
import $ from '../expressions';

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
    label: 'Zoom In',
    accelerator: P('Cmd+=', 'Ctrl+='),
    click: $.all(
      $.memo('zoom-level', $.sum($.pref('zoom-level', $.val(0)), $.val(1))),
      $.sendToWebView('zoom-level', $.memo('zoom-level')),
      $.setPref('zoom-level', $.memo('zoom-level')),
      $.unmemo('zoom-level')
    )
  }, {
    label: 'Zoom Out',
    accelerator: P('Cmd+-', 'Ctrl+-'),
    click: $.all(
      $.memo('zoom-level', $.sum($.pref('zoom-level', $.val(0)), $.val(-1))),
      $.sendToWebView('zoom-level', $.memo('zoom-level')),
      $.setPref('zoom-level', $.memo('zoom-level')),
      $.unmemo('zoom-level')
    )
  }, {
    label: 'Reset Zoom',
    accelerator: P('Cmd+0', 'Ctrl+0'),
    click: $.all(
      $.sendToWebView('zoom-level', $.val(0)),
      $.unsetPref('zoom-level')
    )
  }, {
    type: 'separator'
  }, {
    label: 'Toggle &Full Screen',
    accelerator: P('Cmd+Ctrl+F', 'F11'),
    click: $.toggleFullScreen()
  }, {
    label: 'Toggle &Developer Tools',
    accelerator: P('Alt+Cmd+I', 'Alt+Ctrl+I'),
    click: $.toggleDevTools()
  }]
};
