import $ from './expr';

export default {
  label: '&Settings',
  platform: $.isNonDarwin,
  submenu: [{
    type: 'checkbox',
    label: '&Spell Checker',
    click: $.all(
      $.sendToWebContents('spell-checker', $.key('checked')),
      $.updateSibling('auto-correct', 'enabled', $.key('checked')), // TODO ensure bound to parent
      $.setPref('spell-checker', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('spell-checker', $.val(false))),
      $.updateSibling('auto-correct', 'enabled', $.key('checked'))
    )
  }, {
    id: 'auto-correct',
    type: 'checkbox',
    label: '&Auto Correct',
    click: $.all(
      $.sendToWebContents('auto-correct', $.key('checked')),
      $.setPref('auto-correct', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('auto-correct', $.val(false)))
    )
  }]
};
