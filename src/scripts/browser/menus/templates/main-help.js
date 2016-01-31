import manifest from '../../../../package.json';
import platform from '../../utils/platform';
import $ from '../expressions';
import os from 'os';

export default {
  label: '&Help',
  role: 'help',
  submenu: [{
    label: 'Version ' + manifest.version,
    allow: platform.isNonDarwin,
    enabled: false
  }, {
    id: 'check-for-update',
    label: 'Check for &Update',
    allow: platform.isNonDarwin && global.application.autoUpdateManager.enabled,
    click: $.checkForUpdate()
  }, {
    type: 'separator',
    allow: platform.isNonDarwin
  }, {
    label: 'Gitter &Chat',
    click: $.openUrl('https://gitter.im/Aluxian/Whatsie')
  }, {
    label: '&Suggest Feature',
    click: $.openUrl('https://github.com/Aluxian/Whatsie/issues/new?labels=request')
  }, {
    label: '&Report Issue',
    click: $.openUrl('https://github.com/Aluxian/Whatsie/issues/new?body=' + encodeURIComponent([
      '**What is your issue?**',
      '',
      '',
      '**What are the steps to reproduce it?**',
      '',
      '',
      '--',
      manifest.productName + ' v' + manifest.version,
      [process.platform, process.arch, os.release()].join(' ')
    ].join('\n')))
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
