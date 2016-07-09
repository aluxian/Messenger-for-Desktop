import platform from 'common/utils/platform';
import $ from 'browser/menus/expressions';

export default {
  label: '&View',
  submenu: [{
    label: 'Zoom In',
    accelerator: 'CmdOrCtrl+=',
    needsWindow: true,
    click: $.all(
      $.setPref('zoom-level', $.sum($.pref('zoom-level'), $.val(1))),
      $.sendToWebView('zoom-level', $.pref('zoom-level'))
    )
  }, {
    label: 'Zoom Out',
    accelerator: 'CmdOrCtrl+-',
    needsWindow: true,
    click: $.all(
      $.setPref('zoom-level', $.sum($.pref('zoom-level'), $.val(-1))),
      $.sendToWebView('zoom-level', $.pref('zoom-level'))
    )
  }, {
    label: 'Reset Zoom',
    accelerator: 'CmdOrCtrl+0',
    needsWindow: true,
    click: $.all(
      $.sendToWebView('zoom-level', $.val(0)),
      $.unsetPref('zoom-level')
    )
  }, {
    type: 'separator'
  }, {
    needsWindow: true,
    role: 'togglefullscreen'
  }, {
    label: 'Toggle &Developer Tools',
    accelerator: 'Alt+CmdOrCtrl+I',
    needsWindow: true,
    click: $.toggleDevTools()
  }, {
    label: 'Toggle &Menu Bar',
    accelerator: 'Alt+Ctrl+B',
    needsWindow: true,
    allow: platform.isNonDarwin,
    click: $.toggleMenuBar()
  }, {
    type: 'separator'
  }, {
    label: 'N&ew Conversation',
    accelerator: 'CmdOrCtrl+N',
    needsWindow: true,
    click: $.sendToWebView('new-conversation')
  }, {
    label: 'Search &Chats',
    accelerator: 'CmdOrCtrl+F',
    needsWindow: true,
    click: $.sendToWebView('search-chats')
  }, {
    type: 'separator'
  }, {
    label: '&Next Conversation',
    accelerator: 'CmdOrCtrl+Down',
    needsWindow: true,
    click: $.sendToWebView('switch-conversation', $.val(+1))
  }, {
    label: '&Previous Conversation',
    accelerator: 'CmdOrCtrl+Up',
    needsWindow: true,
    click: $.sendToWebView('switch-conversation', $.val(-1))
  }, {
    label: 'Switch to Conversation',
    submenu: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => ({
      label: 'Conversation ' + index,
      accelerator: 'CmdOrCtrl+' + (index % 10),
      needsWindow: true,
      click: $.sendToWebView('switch-conversation', $.val(1000 + index))
    }))
  }/*, {
    type: 'separator'
  }, {
    label: 'Send Photo or &Video',
    accelerator: 'CmdOrCtrl+O',
    needsWindow: true,
    click: $.sendToWebView('send-photo-video')
  }, {
    label: '&Take Photo',
    accelerator: 'CmdOrCtrl+P',
    needsWindow: true,
    click: $.sendToWebView('take-photo')
  }*/]
};
