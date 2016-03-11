import $ from '../expressions';

export default {
  label: '&Help',
  role: 'help',
  submenu: [{
    label: 'Ra&ffle Code',
    click: $.openRaffleDialog()
  }, {
    type: 'separator'
  }, {
    label: 'Gitter &Chat',
    click: $.openUrl('https://gitter.im/Aluxian/Whatsie')
  }, {
    label: '&Write a Review',
    click: $.openUrl('https://aluxian.typeform.com/to/s0wi5P')
  }, {
    label: '&Suggest a Feature',
    click: $.openUrl('https://aluxian.typeform.com/to/adWvdX')
  }, {
    label: '&Report an Issue',
    click: $.openUrl('https://aluxian.typeform.com/to/A30zq7')
  }, {
    type: 'separator'
  }, {
    label: '&Email Developer',
    click: $.openUrl('mailto:me@aluxian.com')
  }, {
    label: '&Tweet Developer',
    click: $.openUrl('https://twitter.com/Aluxian')
  }, {
    type: 'separator'
  }, {
    label: 'Donate &PayPal',
    click: $.openUrl('https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4YVCUBK2QJKBL')
  }, {
    label: 'Donate &Bitcoin',
    click: $.openUrl('https://www.coinbase.com/Aluxian')
  }]
};
