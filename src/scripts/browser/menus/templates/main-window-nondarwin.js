import platform from '../../../common/utils/platform';
import $ from '../expressions';

export default {
  label: 'Window',
  allow: platform.isNonDarwin,
  submenu: [{
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
    label: 'Close with &Escape',
    click: $.setPref('close-with-esc', $.key('checked')),
    parse: $.setLocal('checked', $.pref('close-with-esc'))
  }, {
    type: 'checkbox',
    label: 'Open Links in &Browser',
    click: $.setPref('links-in-browser', $.key('checked')),
    parse: $.setLocal('checked', $.pref('links-in-browser'))
  }, {
    type: 'checkbox',
    label: '&Notifications Badge in Taskbar',
    click: $.all(
      $.setPref('show-notifications-badge', $.key('checked')),
      $.hideTaskbarBadge($.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('show-notifications-badge'))
    )
  }]
};
