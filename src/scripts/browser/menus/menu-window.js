import platform from '../utils/platform';
import $ from './expr';

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
