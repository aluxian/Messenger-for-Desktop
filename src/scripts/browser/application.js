import MainWindowManager from 'browser/managers/main-window-manager';
import AutoUpdateManager from 'browser/managers/auto-update-manager';
import MainMenuManager from 'browser/managers/main-menu-manager';

import AutoLauncher from 'browser/components/auto-launcher';
import TrayManager from 'browser/managers/tray-manager';

import AppListenersManager from 'browser/managers/app-listeners-manager';

class Application {

  init () {
    this.unreadCount = 0;

    // Create the main app window
    this.mainWindowManager = new MainWindowManager();
    this.mainWindowManager.createWindow();
    this.mainWindowManager.initWindow();

    // Enable the auto updater
    this.autoUpdateManager = new AutoUpdateManager(this.mainWindowManager);
    if (this.autoUpdateManager.enabled) {
      this.autoUpdateManager.init();
      this.autoUpdateManager.scheduleUpdateChecks();
    }

    // Create and set the main menu
    this.menuManager = new MainMenuManager();
    this.menuManager.create();
    this.menuManager.setDefault();
    this.menuManager.setAutoUpdaterListeners();
    this.mainWindowManager.setMenuManager(this.menuManager);

    // Others
    this.autoLauncher = new AutoLauncher();

    // Create and set the tray icon
    this.trayManager = new TrayManager(this.mainWindowManager);
    this.mainWindowManager.setTrayManager(this.trayManager);

    // Listeners
    new AppListenersManager(this.mainWindowManager, this.autoUpdateManager).set();
  }

}

export default Application;
