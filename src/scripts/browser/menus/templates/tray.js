import {app, Menu} from 'electron';

import {findItemByLabel} from 'browser/menus/utils';
import prefs from 'browser/utils/prefs';

export default [{
  id: 'show-tray',
  type: 'checkbox',
  label: 'Show in Menu Bar',
  visible: process.platform === 'darwin',
  checked: prefs.get('show-tray'),
  enabled: prefs.get('show-dock'),
  click (menuItem) {
    if (menuItem.checked) {
      global.application.trayManager.create();
    } else {
      global.application.trayManager.destroy();
    }
    menuItem.menu.items.find(e => e.label === 'Show in Dock').enabled = menuItem.checked;
    const trayMenuItem = findItemByLabel(Menu.getApplicationMenu().items, 'Show in Tray');
    trayMenuItem.checked = menuItem.checked;
    trayMenuItem.menu.items.find(e => e.label === 'Show in Dock').enabled = menuItem.checked;
    prefs.set('show-tray', menuItem.checked);
  }
}, {
  id: 'show-dock',
  type: 'checkbox',
  label: 'Show in Dock',
  visible: process.platform === 'darwin',
  checked: prefs.get('show-dock'),
  enabled: prefs.get('show-tray'),
  click (menuItem) {
    if (menuItem.checked) {
      app.dock.show();
    } else {
      app.dock.hide();
    }
    menuItem.menu.items.find(e => e.label === 'Show in Tray').enabled = menuItem.checked;
    const dockMenuItem = findItemByLabel(Menu.getApplicationMenu().items, 'Show in Dock');
    dockMenuItem.checked = menuItem.checked;
    dockMenuItem.menu.items.find(e => e.label === 'Show in Tray').enabled = menuItem.checked;
    prefs.set('show-dock', menuItem.checked);
  }
}, {
  type: 'separator',
  visible: process.platform === 'darwin'
}, {
  label: 'Show App',
  click (menuItem, browserWindow) {
    browserWindow.show();
  }
}, {
  label: 'Quit',
  click () {
    app.quit();
  }
}];
