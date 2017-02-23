import $ from 'browser/menus/expressions';

export default {
  label: '&Help',
  role: 'help',
  submenu: [{
    label: 'App Website',
    click: $.openUrl('https://messengerfordesktop.com/')
  }, {
    type: 'separator'
  }, {
    label: 'Email Us',
    click: $.openUrl('mailto:hello@messengerfordesktop.com')
  }]
};
