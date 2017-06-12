import {app} from 'electron';

import {findItemByLabel} from 'browser/menus/utils';
import prefs from 'browser/utils/prefs';

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
    click (menuItem, browserWindow) {
      prefs.set('show-notifications-badge', menuItem.checked);
      if (process.platform === 'win32') {
        if (!menuItem.checked) {
          browserWindow.setOverlayIcon(null, '');
        }
      } else {
        if (!menuItem.checked) {
          app.setBadgeCount(0);
        }
      }
    }
  }, {
    type: 'checkbox',
    label: 'Accept First Click',
    checked: prefs.get('accept-first-mouse'),
    click (menuItem) {
      prefs.set('accept-first-mouse', menuItem.checked);
      app.relaunch();
      app.quit();
    }
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: 'Show in Tray',
    visible: process.platform !== 'darwin',
    checked: prefs.get('show-tray'),
    click (menuItem) {
      if (menuItem.checked) {
        global.application.trayManager.create();
      } else {
        global.application.trayManager.destroy();
      }
      prefs.set('show-tray', menuItem.checked);
    }
  }, {
    type: 'checkbox',
    label: 'Show in Menu Bar',
    visible: process.platform === 'darwin',
    checked: prefs.get('show-tray'),
    enabled: prefs.get('show-dock'),
    click (menuItem, browserWindow) {
      if (menuItem.checked) {
        global.application.trayManager.create();
      } else {
        global.application.trayManager.destroy();
      }
      menuItem.menu.items.find(e => e.label === 'Show in Dock').enabled = menuItem.checked;
      const trayMenuItem = findItemByLabel(global.application.trayManager.menu.items, 'Show in Tray');
      trayMenuItem.checked = menuItem.checked;
      trayMenuItem.menu.items.find(e => e.label === 'Show in Dock').enabled = menuItem.checked;
      const menuBarMenuItem = findItemByLabel(global.application.trayManager.menu.items, 'Show in Menu Bar');
      menuBarMenuItem.checked = menuItem.checked;
      menuBarMenuItem.menu.items.find(e => e.label === 'Show in Dock').enabled = menuItem.checked;
      prefs.set('show-tray', menuItem.checked);
    }
  }, {
    type: 'checkbox',
    label: 'Show in Dock',
    visible: process.platform === 'darwin',
    checked: prefs.get('show-dock'),
    enabled: prefs.get('show-tray'),
    click (menuItem, browserWindow) {
      if (menuItem.checked) {
        app.dock.show();
      } else {
        app.dock.hide();
      }
      menuItem.menu.items.find(e => e.label === 'Show in Tray').enabled = menuItem.checked;
      const dockMenuItem = findItemByLabel(global.application.trayManager.menu.items, 'Show in Dock');
      dockMenuItem.checked = menuItem.checked;
      dockMenuItem.menu.items.find(e => e.label === 'Show in Tray').enabled = menuItem.checked;
      prefs.set('show-dock', menuItem.checked);
    }
  }, {
    type: 'separator',
    visible: process.platform === 'darwin'
  }, {
    role: 'minimize',
    visible: process.platform === 'darwin'
  }, {
    role: 'zoom',
    visible: process.platform === 'darwin'
  }, {
    role: 'close',
    visible: process.platform === 'darwin'
  }]
};
