import platform from 'common/utils/platform';
import $ from 'browser/menus/expressions';

export default {
  label: '&View',
  submenu: [{
    label: 'Zoom In',
    accelerator: 'CmdOrCtrl+plus',
    needsWindow: true,
    click: $.all(
      $.setPref('zoom-level', $.sum($.pref('zoom-level'), $.val(+0.25))),
      $.sendToWebContents('zoom-level', $.pref('zoom-level'))
    )
  }, {
    label: 'Zoom Out',
    accelerator: 'CmdOrCtrl+-',
    needsWindow: true,
    click: $.all(
      $.setPref('zoom-level', $.sum($.pref('zoom-level'), $.val(-0.25))),
      $.sendToWebContents('zoom-level', $.pref('zoom-level'))
    )
  }, {
    label: 'Reset Zoom',
    accelerator: 'CmdOrCtrl+0',
    needsWindow: true,
    click: $.all(
      $.sendToWebContents('zoom-level', $.val(0)),
      $.unsetPref('zoom-level')
    )
  }, {
    type: 'separator'
  }, {
    needsWindow: true,
    role: 'togglefullscreen'
  }, {
    label: 'Toggle &Developer Tools',
    needsWindow: true,
    click: $.toggleDevTools()
  }, {
    label: 'Toggle WebView &Dev Tools',
    needsWindow: true,
    click: $.toggleWebViewDevTools()
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: 'Auto Hide &Menu Bar',
    accelerator: 'Alt+Ctrl+B',
    needsWindow: true,
    allow: platform.isNonDarwin,
    click: $.all(
      $.setPref('auto-hide-menubar', $.key('checked')),
      $.autoHideMenuBar($.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('auto-hide-menubar'))
    )
  }, {
    type: 'separator'
  }, {
  //   type: 'checkbox',
  //   label: 'Auto Hide Sidebar',
  //   needsWindow: true,
  //   click: $.all(
  //     $.styleCss('auto-hide-sidebar', (css) =>
  //       $.sendToWebView('apply-sidebar-auto-hide', $.key('checked'), $.val(css))
  //     ),
  //     $.setPref('sidebar-auto-hide', $.key('checked'))
  //   ),
  //   parse: $.all(
  //     $.setLocal('checked', $.pref('sidebar-auto-hide'))
  //   )
  // }, {
  //   type: 'separator'
  // }, {
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
    click: $.sendToWebView('switch-conversation-next')
  }, {
    label: '&Previous Conversation',
    accelerator: 'CmdOrCtrl+Up',
    needsWindow: true,
    click: $.sendToWebView('switch-conversation-previous')
  }, {
    label: 'Switch to Conversation',
    submenu: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => ({
      label: 'Conversation ' + num,
      accelerator: 'CmdOrCtrl+' + num,
      needsWindow: true,
      click: $.sendToWebView('switch-conversation-num', $.val(num))
    }))
  }]
};
