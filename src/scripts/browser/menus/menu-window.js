import $ from './expr';

export default {
  label: 'Window',
  platform: $.isDarwin,
  role: 'window',
  submenu: [{
    label: 'Minimize',
    accelerator: 'Cmd+M',
    role: 'minimize'
  }, {
    type: 'separator'
  }, {
    label: 'Reset',
    accelerator: 'Cmd+Alt+R',
    click: $.all(
      $.resetWindow(),
      $.unsetPref('bounds')
    )
  }, {
    label: 'Close',
    accelerator: 'Cmd+W',
    role: 'close'
  }]
};
