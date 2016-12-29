import $ from 'browser/menus/expressions';

export default {
  label: '&Help',
  role: 'help',
  submenu: [{
    label: 'Website',
    click: $.all(
      $.openUrl('http://messengerfordesktop.com/')
    )
  }, {
    label: 'Email',
    click: $.all(
      $.openUrl('mailto:hello@messengerfordesktop.com'),
    )
  }]
};
