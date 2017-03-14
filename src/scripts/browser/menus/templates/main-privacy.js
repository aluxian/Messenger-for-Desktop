import $ from 'browser/menus/expressions';

export default {
  label: 'Privacy',
  submenu: [{
    type: 'checkbox',
    label: '&Report App Stats and Crashes',
    click: $.setPref('analytics-track', $.key('checked')),
    parse: $.setLocal('checked', $.pref('analytics-track'))
  }, {
    id: 'block-seen-typing',
    type: 'checkbox',
    label: '&Block Seen and Typing Indicators',
    click: $.all(
      $.setPref('block-seen-typing', $.key('checked')),
      $.blockSeenTyping($.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('block-seen-typing'))
    )
  }]
};
