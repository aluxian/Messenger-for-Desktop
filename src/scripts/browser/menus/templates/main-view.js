import platform from '../../utils/platform';
import $ from '../expressions';

export default {
  label: '&View',
  submenu: [{
    label: '&Reload',
    accelerator: 'Ctrl+R',
    allow: platform.isNonDarwin,
    click: $.reloadWindow()
  }, {
    label: 'Re&set Window',
    accelerator: 'Ctrl+Alt+R',
    allow: platform.isNonDarwin,
    click: $.resetWindow()
  }, {
    type: 'separator',
    allow: platform.isNonDarwin
  }, {
    label: 'Zoom In',
    accelerator: 'CmdOrCtrl+=',
    click: $.all(
      $.setPref('zoom-level', $.sum($.pref('zoom-level'), $.val(1))),
      $.sendToWebView('zoom-level', $.pref('zoom-level'))
    )
  }, {
    label: 'Zoom Out',
    accelerator: 'CmdOrCtrl+-',
    click: $.all(
      $.setPref('zoom-level', $.sum($.pref('zoom-level'), $.val(-1))),
      $.sendToWebView('zoom-level', $.pref('zoom-level'))
    )
  }, {
    label: 'Reset Zoom',
    accelerator: 'CmdOrCtrl+0',
    click: $.all(
      $.sendToWebView('zoom-level', $.val(0)),
      $.unsetPref('zoom-level')
    )
  }, {
    type: 'separator'
  }, {
    label: 'Toggle &Full Screen',
    accelerator: platform.isDarwin ? 'Cmd+Ctrl+F' : 'F11',
    click: $.toggleFullScreen()
  }, {
    label: 'Toggle &Developer Tools',
    accelerator: 'Alt+CmdOrCtrl+I',
    click: $.toggleDevTools()
  }, {
    type: 'separator'
  }, {
    label: 'New Conversation',
    accelerator: 'CmdOrCtrl+N',
    click: $.sendToWebView('new-conversation')
  }, {
    label: 'Search Chats',
    accelerator: 'CmdOrCtrl+F',
    click: $.sendToWebView('search-chats')
  }]
};
