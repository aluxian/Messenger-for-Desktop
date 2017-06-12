import EventEmitter from 'events';
import {Menu} from 'electron';

import AutoUpdater from 'browser/components/auto-updater';
import {findItemByLabel} from 'browser/menus/utils';
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
      this.cfuVisibleItem = findItemByLabel(this.menu.items, 'Check for Update...');
    }

    const eventToLabelMap = {
      'error': 'Check for Update...',
      'checking-for-update': 'Checking for Update...',
      'update-available': 'Download Update...',
      'update-not-available': 'Check for Update...',
      'update-downloaded': 'Restart and Install Update...'
    };

    for (let [eventName, itemLabel] of Object.entries(eventToLabelMap)) {
      AutoUpdater.on(eventName, () => {
        log('auto updater on:', eventName, 'params:', ...arguments);
        this.cfuVisibleItem.visible = false;
        this.cfuVisibleItem = findItemByLabel(this.menu.items, itemLabel);
        this.cfuVisibleItem.visible = true;
      });
    }
  }

}

export default MainMenuManager;
