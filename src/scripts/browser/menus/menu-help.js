import manifest from '../../../package.json';
import platform from '../utils/platform';
import $ from './expr';

export default {
  label: '&Help',
  role: 'help',
  submenu: [{
    label: 'Version ' + manifest.version,
    platform: platform.isNonDarwin,
    enabled: false
  }, {
    label: 'Check for &Update',
    platform: platform.isNonDarwin,
    click: $.checkForUpdate()
  }, {
    type: 'separator',
    platform: platform.isNonDarwin
  }, {
    label: 'Gitter &Chat',
    click: $.openUrl('https://gitter.im/Aluxian/Whatsie')
  }, {
    label: '&Suggest Feature',
    click: $.openUrl('https://github.com/Aluxian/Whatsie/issues/new?labels=request')
  }, {
    label: '&Report Issue',
    click: $.openUrl('https://github.com/Aluxian/Whatsie/issues')
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
    label: 'Donate &Bitcoins',
    click: $.openUrl('https://www.coinbase.com/checkouts/cf0d7f14d3413fdebcc0de9a2a934fdf')
  }]
};
