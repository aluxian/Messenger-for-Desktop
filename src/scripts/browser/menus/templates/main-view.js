import prefs from 'browser/utils/prefs';
import files from 'common/utils/files';
import $ from 'browser/menus/expressions';

export default {
  label: 'View',
  submenu: [{
    role: 'zoomin'
  }, {
    role: 'zoomout'
  }, {
    role: 'resetzoom'
  }, {
    type: 'separator'
  }, {
    role: 'togglefullscreen'
  }, {
    role: 'toggledevtools'
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: 'Auto Hide Menu Bar',
    accelerator: 'Alt+Ctrl+B',
    allow: process.platform !== 'darwin',
    checked: prefs.get('auto-hide-menubar'),
    click: $.all(
      $.setPref('auto-hide-menubar', $.key('checked')),
      $.autoHideMenuBar($.key('checked'))
    )
  }, {
    type: 'checkbox',
    label: 'Auto Hide Sidebar',
    checked: prefs.get('sidebar-auto-hide'),
    click (menuItem, browserWindow) {
      files.getStyleCss('sidebar-auto-hide')
        .then((css) => browserWindow.webContents.send('fwd-webview', 'apply-sidebar-auto-hide', menuItem.checked, css))
        .catch(logError);
      prefs.set('sidebar-auto-hide', menuItem.checked);
    }
  }, {
    type: 'separator'
  }, {
    label: 'New Conversation',
    accelerator: 'CmdOrCtrl+N',
    click (menuItem, browserWindow) {
      browserWindow.webContents.send('fwd-webview', 'new-conversation');
    }
  }, {
    label: 'Search Conversation',
    accelerator: 'CmdOrCtrl+F',
    click (menuItem, browserWindow) {
      browserWindow.webContents.send('fwd-webview', 'search-conversation');
    }
  }, {
    label: 'Search Chats',
    accelerator: 'CmdOrCtrl+Shift+F',
    click (menuItem, browserWindow) {
      browserWindow.webContents.send('fwd-webview', 'search-chats');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Next Conversation',
    accelerator: 'CmdOrCtrl+Down',
    click (menuItem, browserWindow) {
      browserWindow.webContents.send('fwd-webview', 'switch-conversation-next');
    }
  }, {
    label: 'Previous Conversation',
    accelerator: 'CmdOrCtrl+Up',
    click (menuItem, browserWindow) {
      browserWindow.webContents.send('fwd-webview', 'switch-conversation-previous');
    }
  }, {
    label: 'Switch to Conversation',
    submenu: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => ({
      label: 'Conversation ' + num,
      accelerator: 'CmdOrCtrl+' + num,
      click (menuItem, browserWindow) {
        browserWindow.webContents.send('fwd-webview', 'switch-conversation-num', num);
      }
    }))
  }]
};
