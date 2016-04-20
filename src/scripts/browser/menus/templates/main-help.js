import $ from '../expressions';
import g from '../generator';

export default {
  label: '&Help',
  role: 'help',
  submenu: [
    { label: 'Ra&ffle Code', click: $.openRaffleDialog() },
    g.helpLink('Gitter &Chat', 'https://gitter.im/Aluxian/Whatsie', 'gitter_chat'),
    g.separator(),
    g.helpLink('&Write a Review', 'https://aluxian.typeform.com/to/s0wi5P', 'write_review'),
    g.helpLink('&Suggest a Feature', 'https://aluxian.typeform.com/to/adWvdX', 'suggest_feature'),
    g.helpLink('&Report an Issue', 'https://aluxian.typeform.com/to/A30zq7', 'report_issue'),
    g.separator(),
    g.helpLink('&Email Developer', 'mailto:me@aluxian.com', 'contact_developer_email'),
    g.helpLink('&Tweet Developer', 'https://twitter.com/Aluxian', 'contact_developer_tweet'),
    g.separator(),
    g.helpDonate('&PayPal', 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4YVCUBK2QJKBL', 'paypal'),
    g.helpDonate('&Bitcoin', 'https://www.coinbase.com/Aluxian', 'bitcoin')
  ]
};
