import platform from '../../utils/platform';
import $ from '../expressions';

export default {
  label: '&Settings',
  allow: platform.isNonDarwin,
  submenu: [{
    type: 'checkbox',
    label: '&Report Stats and Errors',
    click: $.all(
      $.setPref('analytics-track', $.key('checked')),
      $.reloadWindow()
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('analytics-track'))
    )
  }, {
    type: 'separator',
    allow: !global.options.portable
  }, {
    type: 'checkbox',
    label: '&Launch on Startup',
    allow: !global.options.portable,
    click: $.all(
      $.launchOnStartup($.key('checked')),
      $.updateSibling('startup-hidden', 'enabled', $.key('checked')),
      $.setPref('launch-startup', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('launch-startup')),
      $.updateSibling('startup-hidden', 'enabled', $.key('checked'))
    )
  }, {
    id: 'startup-hidden',
    type: 'checkbox',
    label: 'Start &Hidden on Startup',
    allow: !global.options.portable,
    click: $.all(
      $.setPref('launch-startup-hidden', $.key('checked')),
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('launch-startup-hidden'))
    )
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: 'Check &Spelling While Typing',
    click: $.all(
      $.sendToWebView('spell-checker', $.key('checked'), $.pref('spell-checker-auto-correct')),
      $.updateSibling('spell-checker-auto-correct', 'enabled', $.key('checked')),
      $.setPref('spell-checker', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('spell-checker')),
      $.updateSibling('spell-checker-auto-correct', 'enabled', $.key('checked'))
    )
  }, {
    id: 'spell-checker-auto-correct',
    type: 'checkbox',
    label: '&Auto Correct Spelling Mistakes',
    click: $.all(
      $.sendToWebView('spell-checker', $.pref('spell-checker'), $.key('checked')),
      $.setPref('spell-checker-auto-correct', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('spell-checker-auto-correct'))
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
    label: 'Show in &Tray',
    click: $.all(
      $.showInTray($.key('checked')),
      $.setPref('show-tray', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('show-tray')),
    )
  }, {
    type: 'checkbox',
    label: 'Open Links in &Browser',
    click: $.all(
      $.setPref('links-in-browser', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('links-in-browser'))
    )
  }]
};
