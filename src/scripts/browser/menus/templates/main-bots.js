import {shell} from 'electron';

import $ from 'browser/menus/expressions';

export default {
  label: 'Bots',
  submenu: [{
    label: 'Tomo \t\t Cheap flight alerts, save 70%',
    click: $.all(
      $.sendToWebView('open-messenger-thread', $.val('tomocheapflights?ref=MFD_APP')),
      $.analytics.trackEvent('Menu', 'Open Bot', 'tomocheapflights')
    )
  }, {
    type: 'separator'
  }, {
    label: 'Poncho \t\t Personal weather forecasts',
    click: $.all(
      $.sendToWebView('open-messenger-thread', $.val('hiponcho')),
      $.analytics.trackEvent('Menu', 'Open Bot', 'hiponcho')
    )
  }, {
    label: 'TechCrunch \t Personalized tech news',
    click: $.all(
      $.sendToWebView('open-messenger-thread', $.val('techcrunch')),
      $.analytics.trackEvent('Menu', 'Open Bot', 'techcrunch')
    )
  }, {
    label: 'CNN \t\t Breaking news alerts',
    click: $.all(
      $.sendToWebView('open-messenger-thread', $.val('cnn')),
      $.analytics.trackEvent('Menu', 'Open Bot', 'cnn')
    )
  }, {
    type: 'separator'
  }, {
    label: 'Foxsy \t\t Make new friends',
    click: $.all(
      $.sendToWebView('open-messenger-thread', $.val('foxsybot')),
      $.analytics.trackEvent('Menu', 'Open Bot', 'foxsybot')
    )
  }, {
    label: 'Icon8 \t\t Turn your selfies into art',
    click: $.all(
      $.sendToWebView('open-messenger-thread', $.val('icon8bot')),
      $.analytics.trackEvent('Menu', 'Open Bot', 'icon8bot')
    )
  }, {
    label: 'Sensay \t\t On-demand help from humans',
    click: $.all(
      $.sendToWebView('open-messenger-thread', $.val('sensaybot')),
      $.analytics.trackEvent('Menu', 'Open Bot', 'sensaybot')
    )
  }, {
    label: 'Swelly \t\t Better decisions with friends',
    click: $.all(
      $.sendToWebView('open-messenger-thread', $.val('swell.bot')),
      $.analytics.trackEvent('Menu', 'Open Bot', 'swell.bot')
    )
  }, {
    type: 'separator'
  }, {
    label: 'Discover More Bots',
    click () {
      shell.openExternal('https://chatbottle.co/bots/messenger?ref=messengerfordesktop.com');
    }
  }]
};
