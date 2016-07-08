import EventEmitter from 'events';
import {Menu} from 'electron';

import AutoUpdater from 'browser/components/auto-updater';
import {findItemById} from 'browser/menus/utils';
import template from 'browser/menus/main';

class MainMenuManager extends EventEmitter {

  constructor () {
    super();
    this.cfuVisibleItem = null;
  }

  create () {
    if (!this.menu) {
      this.menu = Menu.buildFromTemplate(template());
      log('app menu created');
    } else {
      log('app menu already created');
    }
  }

  setDefault () {
    if (this.menu) {
      Menu.setApplicationMenu(this.menu);
      log('app menu set');
    } else {
      logError(new Error('menu not created'));
    }
  }

  setAutoUpdaterListeners () {
    if (!this.cfuVisibleItem) {
      this.cfuVisibleItem = findItemById(this.menu.items, 'cfu-check-for-update');
    }

    const eventToIdMap = {
      'error': 'cfu-check-for-update',
      'checking-for-update': 'cfu-checking-for-update',
      'update-available': 'cfu-update-available',
      'update-not-available': 'cfu-check-for-update',
      'update-downloaded': 'cfu-update-downloaded'
    };

    for (let [eventName, itemId] of Object.entries(eventToIdMap)) {
      AutoUpdater.on(eventName, () => {
        log('auto updater on:', eventName, 'params:', ...arguments);
        this.cfuVisibleItem.visible = false;
        this.cfuVisibleItem = findItemById(this.menu.items, itemId);
        this.cfuVisibleItem.visible = true;
      });
    }
  }

  windowSpecificItemsEnabled (enabled, items = this.menu.items) {
    for (let item of items) {
      if (item.needsWindow) {
        item.enabled = enabled;
      } else if (item.submenu) {
        this.windowSpecificItemsEnabled(enabled, item.submenu.items);
      }
    }
  }

}

export default MainMenuManager;
