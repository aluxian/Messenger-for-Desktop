import platform from '../../utils/platform';
import {P} from './utils';
import $ from '../expressions';

export default {
  label: '&View',
  submenu: [{
    label: '&Reload Window',
    accelerator: 'Ctrl+R',
    allow: platform.isNonDarwin,
    click: $.reloadWindow()
  }, {
    label: 'Re&set Window',
    accelerator: 'Ctrl+Alt+R',
    allow: platform.isNonDarwin,
    click: $.all(
      $.resetWindow()
    )
  }, {
    type: 'separator',
    allow: platform.isNonDarwin
  }, {
    label: 'Zoom In',
    accelerator: 'CmdOrCtrl+=',
    click: $.all(
      $.memo('zoom-level', $.sum($.pref('zoom-level'), $.val(1))),
      $.sendToWebView('zoom-level', $.memo('zoom-level')),
      $.setPref('zoom-level', $.memo('zoom-level')),
      $.unmemo('zoom-level')
    )
  }, {
    label: 'Zoom Out',
    accelerator: 'CmdOrCtrl+-',
    click: $.all(
      $.memo('zoom-level', $.sum($.pref('zoom-level'), $.val(-1))),
      $.sendToWebView('zoom-level', $.memo('zoom-level')),
      $.setPref('zoom-level', $.memo('zoom-level')),
      $.unmemo('zoom-level')
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
    accelerator: P('Cmd+Ctrl+F', 'F11'),
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
