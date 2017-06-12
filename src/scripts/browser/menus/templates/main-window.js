import prefs from 'browser/utils/prefs';
import $ from 'browser/menus/expressions';

export default {
  role: 'window',
  submenu: [{
    role: 'forcereload'
  }, {
    label: 'Reset Bounds',
    accelerator: 'CmdOrCtrl+Alt+R',
    click (menuItem, browserWindow) {
      const bounds = prefs.getDefault('window-bounds');
      browserWindow.setSize(bounds.width, bounds.height, true);
      browserWindow.center();
    }
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: 'Float on Top',
    accelerator: 'CmdOrCtrl+Alt+T',
    click (menuItem, browserWindow) {
      browserWindow.setAlwaysOnTop(menuItem.checked);
    }
  }, {
    type: 'checkbox',
    label: 'Close with Escape Key',
    checked: prefs.get('close-with-esc'),
    click (menuItem) {
      prefs.set('close-with-esc', menuItem.checked);
    }
  }, {
    type: 'checkbox',
    label: 'Open Links in Browser',
    checked: prefs.get('links-in-browser'),
    click (menuItem) {
      prefs.set('links-in-browser', menuItem.checked);
    }
  }, {
    type: 'checkbox',
    label: 'Notifications Badge in ' + (process.platform === 'win32' ? 'Taskbar' : 'Dock'),
    checked: prefs.get('show-notifications-badge'),
    click: $.all(
      $.setPref('show-notifications-badge', $.key('checked')),
      process.platform === 'win32' ? $.hideTaskbarBadge($.key('checked')) : $.hideDockBadge($.key('checked'))
    )
  }, {
    type: 'checkbox',
    label: 'Accept First Click',
    checked: prefs.get('accept-first-mouse'),
    click: $.all(
      $.setPref('accept-first-mouse', $.key('checked')),
      $.restartApp()
    )
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: 'Show in Tray',
    allow: process.platform !== 'darwin',
    checked: prefs.get('show-tray'),
    click: $.all(
      $.showInTray($.key('checked')),
      $.setPref('show-tray', $.key('checked'))
    )
  }, {
    id: 'show-tray',
    type: 'checkbox',
    label: 'Show in Menu Bar',
    allow: process.platform === 'darwin',
    checked: prefs.get('show-tray'),
    enabled: prefs.get('show-dock'),
    click: $.all(
      $.showInTray($.key('checked')),
      $.updateSibling('show-dock', 'enabled', $.key('checked')),
      $.updateMenuItem('tray', 'show-tray')($.key('checked'))((checked) => $.all(
        $.setLocal('checked', $.val(checked)),
        $.updateSibling('show-dock', 'enabled', $.val(checked))
      )),
      $.setPref('show-tray', $.key('checked'))
    )
  }, {
    id: 'show-dock',
    type: 'checkbox',
    label: 'Show in Dock',
    allow: process.platform === 'darwin',
    checked: prefs.get('show-dock'),
    enabled: prefs.get('show-tray'),
    click: $.all(
      $.showInDock($.key('checked')),
      $.updateSibling('show-tray', 'enabled', $.key('checked')),
      $.updateMenuItem('tray', 'show-dock')($.key('checked'))((checked) => $.all(
        $.setLocal('checked', $.val(checked)),
        $.updateSibling('show-tray', 'enabled', $.val(checked))
      )),
      $.setPref('show-dock', $.key('checked'))
    ),
    parse: $.all(
      $.showInDock($.key('checked'))
    )
  }, {
    type: 'separator',
    allow: process.platform === 'darwin'
  }, {
    role: 'minimize',
    allow: process.platform === 'darwin'
  }, {
    role: 'zoom',
    allow: process.platform === 'darwin'
  }, {
    role: 'close',
    allow: process.platform === 'darwin'
  }]
};
