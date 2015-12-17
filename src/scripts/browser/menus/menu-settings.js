import platform from '../utils/platform';
import $ from './expr';

export default {
  label: '&Settings',
  platform: platform.isNonDarwin,
  submenu: [{
    type: 'checkbox',
    label: 'Check &Spelling While Typing',
    click: $.all(
      $.sendToWebContents('spell-checker', $.key('checked'), $.pref('auto-correct')),
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
      $.sendToWebContents('auto-correct', $.key('checked')),
      $.setPref('auto-correct', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('auto-correct', $.val(false)))
    )
  }]
};
