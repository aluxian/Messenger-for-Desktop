const fileMenu = {
  label: '&File',
  submenu: [{
    label: '&Settings',
    command: 'application:show-settings'
  }, {
    label: '&Quit',
    accelerator: 'Ctrl+Q',
    command: 'application:quit'
  }]
};

const viewMenu = {
  label: '&View',
  submenu: [{
    label: '&Reload',
    accelerator: 'Ctrl+R',
    command: 'window:reload'
  }, {
    label: 'Re&set Window',
    accelerator: 'Ctrl+Alt+R',
    command: 'window:reset'
  }, {
    type: 'separator'
  }, {
    label: 'Zoom &In',
    accelerator: 'Ctrl+Plus',
    command: 'window:zoom-in'
  }, {
    label: 'Zoom &Out',
    accelerator: 'Ctrl+-',
    command: 'window:zoom-out'
  }, {
    label: 'Reset &Zoom',
    accelerator: 'Ctrl+0',
    command: 'window:zoom-reset'
  }, {
    type: 'separator'
  }, {
    label: 'Toggle &Full Screen',
    accelerator: 'F11',
    command: 'window:toggle-full-screen'
  }, {
    label: 'Toggle &Developer Tools',
    accelerator: 'Alt+Ctrl+I',
    command: 'window:toggle-dev-tools'
  }]
};

const themeMenu = {
  label: '&Theme',
  submenu: [{
    type: 'radio',
    label: 'Default',
    command: 'application:update-theme',
    theme: 'default'
  }, {
    type: 'radio',
    label: 'Grey',
    command: 'application:update-theme',
    theme: 'grey'
  }, {
    type: 'radio',
    label: 'Pure',
    command: 'application:update-theme',
    theme: 'pure'
  }, {
    type: 'radio',
    label: 'Dark',
    command: 'application:update-theme',
    theme: 'dark'
  }]
};

const helpMenu = {
  label: '&Help',
  submenu: [{
    label: 'Version {{ version },},',
    enabled: false
  }, {
    label: 'Check for &Update',
    command: 'application:check-for-update'
  }, {
    type: 'separator'
  }, {
    label: '&Report Issue',
    command: 'application:open-url',
    url: 'https://github.com/Aluxian/Whatsie/issues'
  }, {
    label: '&Suggest Feature',
    command: 'application:open-url',
    url: 'https://github.com/Aluxian/Whatsie/issues'
  }, {
    type: 'separator'
  }, {
    label: '&Email Developer',
    command: 'application:open-url',
    url: 'mailto:me@aluxian.com'
  }, {
    label: '&Tweet Developer',
    command: 'application:open-url',
    url: 'https://twitter.com/Aluxian'
  }, {
    type: 'separator'
  }, {
    label: 'Donate &PayPal',
    command: 'application:open-url',
    url: 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4YVCUBK2QJKBL'
  }, {
    label: 'Donate &Bitcoins',
    command: 'application:open-url',
    url: 'https://www.coinbase.com/checkouts/cf0d7f14d3413fdebcc0de9a2a934fdf'
  }]
};

export default [
  fileMenu,
  viewMenu,
  themeMenu,
  helpMenu
];
