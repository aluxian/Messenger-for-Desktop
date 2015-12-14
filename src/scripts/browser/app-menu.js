import app from 'app';
import shell from 'shell';
import debug from 'debug';
import fs from 'fs';

import {ipcMain} from 'electron';
import {isFunction} from 'lodash';
import prefs from './utils/prefs';

import Menu from 'menu';
import AppWindow from './app-window';
import EventEmitter from 'events';

const log = debug('whatsie:app-menu');

class AppMenu extends EventEmitter {

  /**
   * Build the menu based on a platform-specific template.
   */
  constructor() {
    super();
    const template = require(`../../menus/${process.platform}.js`).default;
    this.wireUpTemplate(template);
    this.menu = Menu.buildFromTemplate(template);
  }

  /**
   * Parse template items.
   */
  wireUpTemplate(submenu, parent) {
    submenu.forEach(item => {
      this.restoreFromPrefs(item, parent);

      item.click = (menuItem, browserWindow) => {
        log('menu item clicked', item.label, item.command);
        this.emit(item.command, menuItem, browserWindow);
        this.autoSendWebContents(menuItem, browserWindow);
        this.autoSetItem(menuItem);
        this.autoUnsetItem(menuItem);
      };

      if (item.submenu) {
        this.wireUpTemplate(item.submenu, item);
      }
    });
  }

  /**
   * Set event listeners for menu commands.
   */
  setEventListeners() {
    this.setAppEventListeners();
    this.setWindowEventListeners();
  }

  setAppEventListeners() {
    this.on('application:quit', function() {
      app.exit(0);
    });

    this.on('application:show-settings', function() {
      // TODO
    });

    this.on('application:open-url', function(menuItem) {
      shell.openExternal(menuItem.url);
    });

    this.on('application:check-for-update', () => {
      // TODO
      // Updater.checkAndPrompt(this.manifest, true)
      //   .then(function(willUpdate) {
      //     if (willUpdate) {
      //       app.quit();
      //     }
      //   })
      //   .catch(::console.error);
    });
  }

  setWindowEventListeners() {
    this.on('window:reload', function(menuItem, browserWindow) {
      browserWindow.reload();
    });

    this.on('window:reset', function(menuItem, browserWindow) {
      const bounds = AppWindow.DEFAULT_BOUNDS;
      browserWindow.setSize(bounds.width, bounds.height);
      browserWindow.center();
    });

    this.on('window:zoom-in', function(menuItem, browserWindow) {
      const newLevel = prefs.get('window:zoom-level', 0) + 1;
      browserWindow.webContents.send('zoom-level', newLevel);
      prefs.set('window:zoom-level', newLevel);
    });

    this.on('window:zoom-out', function(menuItem, browserWindow) {
      const newLevel = prefs.get('window:zoom-level', 0) - 1;
      browserWindow.webContents.send('zoom-level', newLevel);
      prefs.set('window:zoom-level', newLevel);
    });

    this.on('window:toggle-full-screen', function(menuItem, browserWindow) {
      const newState = !browserWindow.isFullScreen();
      browserWindow.setFullScreen(newState);
    });

    this.on('window:toggle-dev-tools', function(menuItem, browserWindow) {
      browserWindow.toggleDevTools();
    });
  }

  restoreFromPrefs(item, parent) {
    this.restoreCheckedStateFromPrefs(item, parent);
    this.restoreEnabledIfCheckedState(item, parent);
  }

  restoreEnabledIfCheckedState(item, parent) {
    if (item.enabled === undefined && item.enabledIfChecked) {
      const depItem = parent.submenu.find(i => i.id === item.enabledIfChecked);
      if (depItem) {
        this.restoreFromPrefs(item, parent);
        item.enabled = depItem.checked;
        depItem.click = function(menuItem) {
          if (depItem.click) {
            depItem.click.apply(depItem, arguments);
          }

          console.log('disable item', menuItem);
        };
      }
    }
  }

  restoreCheckedStateFromPrefs(item, parent) {
    if (item.checked == 'pref' && item.prefKey) {
      if (item.valueKey) {
        item.checked = prefs.get(item.prefKey, 'default') === item[item.valueKey];
      } else if (item.value) {
        item.checked = prefs.get(item.prefKey, 'default') === item.value;
      }
    }
  }

  autoSendWebContents(item, browserWindow) {
    if (item.webContentsSendName && item.webContentsSendKey) {
      const value = item[item.webContentsSendKey];
      browserWindow.webContents.send(item.webContentsSendName, value);
    }
  }

  autoSetItem(item) {
    if (item.autoSet && item.prefKey) {
      prefs.set(item.prefKey, item[item.autoSet]);
    }
  }

  autoUnsetItem(item) {
    if (item.autoUnset && item.prefKey) {
      prefs.unset(item.prefKey);
    }
  }

}

export default AppMenu;
