import platform from '../../utils/platform';
import $ from '../expressions';

export default {
  label: '&Settings',
  platform: platform.isNonDarwin,
  submenu: [{
    type: 'checkbox',
    label: 'Check &Spelling While Typing',
    click: $.all(
      $.sendToWebView('spell-checker', $.key('checked'), $.pref('auto-correct')),
      $.updateSibling('auto-correct', 'enabled', $.key('checked')),
      $.setPref('spell-checker', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('spell-checker', $.val(false))),
      $.updateSibling('auto-correct', 'enabled', $.key('checked'))
    )
  }, {
    id: 'auto-correct',
    type: 'checkbox',
    label: '&Auto Correct Spelling Mistakes',
    click: $.all(
      $.sendToWebView('spell-checker', $.pref('spell-checker'), $.key('checked')),
      $.setPref('auto-correct', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('auto-correct', $.val(false)))
    )
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: '&Float on Top',
    accelerator: 'Ctrl+Shift+F',
    click: $.floatOnTop($.key('checked'))
  }, {
    type: 'checkbox',
    label: 'Open Links in &Browser',
    click: $.all(
      $.setPref('links-in-browser', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('links-in-browser', $.val(true)))
    )
  }]
};
