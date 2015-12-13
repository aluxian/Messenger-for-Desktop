import manifest from '../package.json';

const appMenu = {
  label: manifest.productName,
  submenu: [{
    label: 'About ' + manifest.productName,
    role: 'about'
  }, {
    label: 'Check for Update',
    command: 'application:check-for-update'
  }, {
    type: 'separator'
  }, {
    label: 'Preferences...',
    command: 'application:show-settings'
  }, {
    label: 'Services',
    role: 'services',
    submenu: []
  }, {
    type: 'separator'
  }, {
    label: 'Hide ' + manifest.productName,
    accelerator: 'Cmd+H',
    role: 'hide'
  }, {
    label: 'Hide Others',
    accelerator: 'Cmd+Shift+H',
    role: 'hideothers'
  }, {
    label: 'Show All',
    role: 'unhide'
  }, {
    type: 'separator'
  }, {
    label: 'Quit',
    accelerator: 'Cmd+Q',
    command: 'application:quit'
  }]
};

const editMenu = {
  label: 'Edit',
  submenu: [{
    label: 'Undo',
    accelerator: 'Cmd+Z',
    role: 'undo'
  }, {
    label: 'Redo',
    accelerator: 'Shift+Cmd+Z',
    role: 'redo'
  }, {
    type: 'separator'
  }, {
    label: 'Cut',
    accelerator: 'Cmd+X',
    role: 'cut'
  }, {
    label: 'Copy',
    accelerator: 'Cmd+C',
    role: 'copy'
  }, {
    label: 'Paste',
    accelerator: 'Cmd+V',
    role: 'paste'
  }, {
    label: 'Select All',
    accelerator: 'Cmd+A',
    role: 'selectall'
  }]
};

const viewMenu = {
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'Cmd+R',
    command: 'window:reload'
  }, {
    type: 'separator'
  }, {
    label: 'Zoom In',
    accelerator: 'Cmd+Plus',
    command: 'window:zoom-in'
  }, {
    label: 'Zoom Out',
    accelerator: 'Cmd+-',
    command: 'window:zoom-out'
  }, {
    label: 'Reset Zoom',
    accelerator: 'Cmd+0',
    command: 'window:zoom-reset'
  }, {
    type: 'separator'
  }, {
    label: 'Toggle Full Screen',
    accelerator: 'Cmd+Ctrl+F',
    command: 'window:toggle-full-screen'
  }, {
    label: 'Developer Tools',
    accelerator: 'Alt+Cmd+I',
    command: 'window:toggle-dev-tools'
  }]
};

const themeMenu = {
  label: 'Theme',
  submenu: [{
    type: 'radio',
    label: 'Default',
    command: 'application:update-theme',
    checked: 'pref',
    prefKey: 'app:theme',
    valueKey: 'theme',
    theme: 'default'
  }, {
    type: 'radio',
    label: 'Grey',
    command: 'application:update-theme',
    checked: 'pref',
    prefKey: 'app:theme',
    valueKey: 'theme',
    theme: 'grey'
  }, {
    type: 'radio',
    label: 'Pure',
    command: 'application:update-theme',
    checked: 'pref',
    prefKey: 'app:theme',
    valueKey: 'theme',
    theme: 'pure'
  }, {
    type: 'radio',
    label: 'Dark',
    command: 'application:update-theme',
    checked: 'pref',
    prefKey: 'app:theme',
    valueKey: 'theme',
    theme: 'dark'
  }]
};

const windowMenu = {
  label: 'Window',
  role: 'window',
  submenu: [{
    label: 'Minimize',
    accelerator: 'Cmd+M',
    role: 'minimize'
  }, {
    label: 'Zoom',
    accelerator: 'Alt+Cmd+Ctrl+M',
    selector: 'zoom:'
  }, {
    type: 'separator'
  }, {
    label: 'Reset',
    accelerator: 'Cmd+Alt+R',
    command: 'window:reset'
  }, {
    label: 'Close',
    accelerator: 'Cmd+W',
    role: 'close'
  }]
};

const helpMenu = {
  label: 'Help',
  role: 'help',
  submenu: [{
    label: 'Report Issue',
    command: 'application:open-url',
    url: 'https://github.com/Aluxian/Whatsie/issues'
  }, {
    label: 'Suggest Feature',
    command: 'application:open-url',
    url: 'https://github.com/Aluxian/Whatsie/issues'
  }, {
    type: 'separator'
  }, {
    label: 'Email Developer',
    command: 'application:open-url',
    url: 'mailto:me@aluxian.com'
  }, {
    label: 'Tweet Developer',
    command: 'application:open-url',
    url: 'https://twitter.com/Aluxian'
  }, {
    type: 'separator'
  }, {
    label: 'Donate PayPal',
    command: 'application:open-url',
    url: 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4YVCUBK2QJKBL'
  }, {
    label: 'Donate Bitcoins',
    command: 'application:open-url',
    url: 'https://www.coinbase.com/checkouts/cf0d7f14d3413fdebcc0de9a2a934fdf'
  }]
};

export default [
  appMenu,
  editMenu,
  viewMenu,
  themeMenu,
  windowMenu,
  helpMenu
];
