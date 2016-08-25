import $ from 'browser/menus/expressions';

import eventCategories from 'common/analytics/categories';
import eventActions from 'common/analytics/actions';
import eventNames from 'common/analytics/names';

export default {
  label: '&Help',
  role: 'help',
  submenu: [{
    label: 'Frequently Asked &Questions',
    click: $.all(
      $.openUrl('https://whatsie.chat/#faq'),
      $.analytics.trackEvent(
        eventCategories['Menu'],
        eventActions['Open Link'],
        eventNames['FAQ Link']
      )
    )
  }, {
    label: '&Chat on Gitter',
    click: $.all(
      $.openUrl('https://gitter.im/Aluxian/Facebook-Messenger-Desktop'),
      $.analytics.trackEvent(
        eventCategories['Menu'],
        eventActions['Open Link'],
        eventNames['Gitter Chat Link']
      )
    )
  }, {
    type: 'separator'
  }, {
    label: '&Write a Review',
    click: $.all(
      $.openUrl('https://aluxian.typeform.com/to/Wu3xV0'),
      $.analytics.trackEvent(
        eventCategories['Menu'],
        eventActions['Open Link'],
        eventNames['Write Review Link']
      )
    )
  }, {
    label: '&Suggest a Feature',
    click: $.all(
      $.openUrl('https://aluxian.typeform.com/to/RZm1ud'),
      $.analytics.trackEvent(
        eventCategories['Menu'],
        eventActions['Open Link'],
        eventNames['Suggest Feature Link']
      )
    )
  }, {
    label: '&Report an Issue',
    click: $.all(
      $.openUrl('https://aluxian.typeform.com/to/zbEkn3'),
      $.analytics.trackEvent(
        eventCategories['Menu'],
        eventActions['Open Link'],
        eventNames['Report Issue Link']
      )
    )
  }, {
    type: 'separator'
  }, {
    label: '&Email Developer',
    click: $.all(
      $.openUrl('mailto:mfd@aluxian.com'),
      $.analytics.trackEvent(
        eventCategories['Menu'],
        eventActions['Open Link'],
        eventNames['Contact Developer Email Link']
      )
    )
  }, {
    label: '&Tweet Developer',
    click: $.all(
      $.openUrl('https://twitter.com/Aluxian'),
      $.analytics.trackEvent(
        eventCategories['Menu'],
        eventActions['Open Link'],
        eventNames['Contact Developer Twitter Link']
      )
    )
  }, {
    type: 'separator'
  }, {
    label: 'Donate &PayPal',
    click: $.all(
      $.openUrl('https://short.aluxian.com/donatemfdpaypal'),
      $.analytics.trackEvent(
        eventCategories['Menu'],
        eventActions['Open Link'],
        eventNames['Donate PayPal Link']
      )
    )
  }, {
    label: 'Donate &Bitcoin',
    click: $.all(
      $.openUrl('https://short.aluxian.com/donatemfdbitcoin'),
      $.analytics.trackEvent(
        eventCategories['Menu'],
        eventActions['Open Link'],
        eventNames['Donate Bitcoin Link']
      )
    )
  }]
};
