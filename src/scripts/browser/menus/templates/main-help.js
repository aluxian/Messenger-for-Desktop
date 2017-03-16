import $ from 'browser/menus/expressions';

export default {
  label: '&Help',
  role: 'help',
  submenu: [{
    label: 'Open App Website',
    click: $.openUrl('https://messengerfordesktop.com/')
  }, {
    label: 'Send Feedback',
    click: $.openUrl('https://aluxian.typeform.com/to/sr2gEc')
  }]
};
