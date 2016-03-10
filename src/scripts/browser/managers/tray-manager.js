import filePaths from '../utils/file-paths';
import platform from '../utils/platform';
import template from '../menus/tray';
import prefs from '../utils/prefs';

import Menu from 'menu';
import Tray from 'tray';

import EventEmitter from 'events';

class TrayManager extends EventEmitter {

  constructor(mainWindowManager, notifManager) {
    super();

    this.mainWindowManager = mainWindowManager;
    this.notifManager = notifManager;

    // Restore the tray menu from prefs
    if (prefs.get('show-tray')) {
      this.create();
    }
  }

  /**
   * Create and set the default menu.
   */
  create() {
    if (this.tray) {
      return;
    }

    if (platform.isDarwin) {
      this.tray = new Tray(filePaths.getImagePath('trayBlackTemplate.png'));
      this.tray.setPressedImage(filePaths.getImagePath('trayWhiteTemplate.png'));

      // Show the notifications count
      if (this.notifManager.unreadCount) {
        this.tray.setTitle(this.notifManager.unreadCount);
      }
    } else {
      if (this.notifManager.unreadCount) {
        this.tray = new Tray(filePaths.getImagePath('trayAlert.png'));
      } else {
        this.tray = new Tray(filePaths.getImagePath('tray.png'));
      }
    }

    this.menu = Menu.buildFromTemplate(template());
    this.tray.setContextMenu(this.menu);
    this.setEventListeners();
    log('tray menu created');
  }

  /**
   * Listen for tray events.
   */
  setEventListeners() {
    if (this.tray) {
      this.tray.on('click', ::this.onClick);
      this.tray.on('right-click', ::this.onRightClick);
    }
  }

  /**
   * Called when the 'click' event is emitted on the tray menu.
   */
  onClick() {
    // Show the main window
    log('tray click');
    if (this.mainWindowManager) {
      const mainWindow = this.mainWindowManager.window;
      if (mainWindow && !mainWindow.isFocused()) {
        mainWindow.show();
      }
    }
  }

  /**
   * Called when the 'right-click' event is emitted on the tray menu.
   */
  onRightClick() {
    // Show the main window
    log('tray right-click');
    if (platform.isDarwin) {
      const mainWindow = this.mainWindowManager.window;
      if (mainWindow && !mainWindow.isFocused()) {
        mainWindow.show();
      }
    }
  }

  /**
   * Hide and destroy the tray menu.
   */
  destroy() {
    if (this.tray) {
      this.tray.destroy();
    }
    this.menu = null;
    this.tray = null;
  }

  /**
   * Called when the unread count changes.
   */
  unreadCountUpdated(count) {
    if (!this.tray) {
      return;
    }

    if (platform.isDarwin) {
      this.tray.setTitle(count);
    } else {
      if (count) {
        this.tray.setImage(filePaths.getImagePath('trayAlert.png'));
      } else {
        this.tray.setImage(filePaths.getImagePath('tray.png'));
      }
    }
  }

}

export default TrayManager;
