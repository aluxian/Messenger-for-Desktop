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
    click: $.all(
      $.openUrl('https://gitter.im/Aluxian/Whatsie'),
      $.analytics.trackEvent('Menu', 'Link', 'gitter_chat')
    )
  }, {
    label: '&Write a Review',
    click: $.all(
      $.openUrl('https://aluxian.typeform.com/to/s0wi5P'),
      $.analytics.trackEvent('Menu', 'Link', 'write_review')
    )
  }, {
    label: '&Suggest a Feature',
    click: $.all(
      $.openUrl('https://aluxian.typeform.com/to/adWvdX'),
      $.analytics.trackEvent('Menu', 'Link', 'suggest_feature')
    )
  }, {
    label: '&Report an Issue',
    click: $.all(
      $.openUrl('https://aluxian.typeform.com/to/A30zq7'),
      $.analytics.trackEvent('Menu', 'Link', 'report_issue')
    )
  }, {
    type: 'separator'
  }, {
    label: '&Email Developer',
    click: $.all(
      $.openUrl('mailto:me@aluxian.com'),
      $.analytics.trackEvent('Menu', 'Link', 'email_developer')
    )
  }, {
    label: '&Tweet Developer',
    click: $.all(
      $.openUrl('https://twitter.com/Aluxian'),
      $.analytics.trackEvent('Menu', 'Link', 'tweet_developer')
    )
  }, {
    type: 'separator'
  }, {
    label: 'Donate &PayPal',
    click: $.all(
      $.openUrl('https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4YVCUBK2QJKBL'),
      $.analytics.trackEvent('Menu', 'Link', 'donate_paypal'),
      $.analytics.trackGoal(1, 1)
    )
  }, {
    label: 'Donate &Bitcoin',
    click: $.all(
      $.openUrl('https://www.coinbase.com/Aluxian'),
      $.analytics.trackEvent('Menu', 'Link', 'donate_bitcoin'),
      $.analytics.trackGoal(1, 1)
    )
  }]
};
