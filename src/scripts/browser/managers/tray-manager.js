import EventEmitter from 'events';
import {Menu, Tray, nativeImage} from 'electron';

import filePaths from 'common/utils/file-paths';
import platform from 'common/utils/platform';
import template from 'browser/menus/tray';
import prefs from 'browser/utils/prefs';

class TrayManager extends EventEmitter {

  constructor (mainWindowManager, notifManager) {
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
  create () {
    if (this.tray) {
      return;
    }

    if (platform.isDarwin) {
      const imagePath = filePaths.getImagePath('trayBlackTemplate.png');
      const image = nativeImage.createFromPath(imagePath);

      const pressedImagePath = filePaths.getImagePath('trayWhiteTemplate.png');
      const pressedImage = nativeImage.createFromPath(pressedImagePath);

      this.tray = new Tray(image);
      this.tray.setPressedImage(pressedImage);

      // Show the notifications count
      if (this.notifManager.unreadCount) {
        this.tray.setTitle(this.notifManager.unreadCount);
      }
    } else {
      const imgExt = platform.isWindows ? 'ico' : 'png';
      const iconName = this.notifManager.unreadCount ? 'trayAlert' : 'tray';

      const imagePath = filePaths.getImagePath(iconName + '.' + imgExt);
      const image = nativeImage.createFromPath(imagePath);

      this.tray = new Tray(image);
    }

    this.menu = Menu.buildFromTemplate(template());
    if (platform.isLinux) {
      this.tray.setContextMenu(this.menu);
    }
    this.setEventListeners();
    log('tray menu created');
  }

  /**
   * Listen for tray events.
   */
  setEventListeners () {
    if (this.tray) {
      this.tray.on('click', ::this.onClick);
      this.tray.on('right-click', ::this.onRightClick);
    }
  }

  /**
   * Called when the 'click' event is emitted on the tray menu.
   */
  onClick () {
    // Show the main window
    log('tray click');
    if (this.mainWindowManager) {
      const mainWindow = this.mainWindowManager.window;
      if (mainWindow) {
        mainWindow.show();
      }
    }
  }

  /**
   * Called when the 'right-click' event is emitted on the tray menu.
   */
  onRightClick () {
    // Show the context menu
    log('tray right-click');
    this.tray.popUpContextMenu(this.menu);
  }

  /**
   * Hide and destroy the tray menu.
   */
  destroy () {
    if (this.tray) {
      this.tray.destroy();
    }
    this.menu = null;
    this.tray = null;
  }

  /**
   * Called when the unread count changes.
   */
  unreadCountUpdated (count) {
    if (!this.tray) {
      return;
    }

    if (platform.isDarwin) {
      this.tray.setTitle(count);
    } else {
      const imgExt = platform.isWindows ? 'ico' : 'png';
      const iconName = count ? 'trayAlert' : 'tray';

      const imagePath = filePaths.getImagePath(iconName + '.' + imgExt);
      const image = nativeImage.createFromPath(imagePath);

      this.tray.setImage(image);
    }
  }

}

export default TrayManager;
