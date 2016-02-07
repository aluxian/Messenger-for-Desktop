import EventEmitter from 'events';

import MainWindowManager from './managers/main-window-manager';
import MainMenuManager from './managers/main-menu-manager';

import AutoLauncher from './components/auto-launcher';
import NativeNotifier from './components/native-notifier';
import AutoUpdateManager from './managers/auto-update-manager';
import NotifManager from './managers/notif-manager';
import TrayManager from './managers/tray-manager';

import AppListenersManager from './managers/app-listeners-manager';
import IpcListenersManager from './managers/ipc-listeners-manager';

class Application extends EventEmitter {

  constructor(manifest, options) {
    super();
    this.manifest = manifest;
    this.options = options;
  }

  init() {
    // Create the main app window
    this.mainWindowManager = new MainWindowManager(this.manifest, this.options);
    this.mainWindowManager.createWindow();
    this.mainWindowManager.initWindow();

    // Enable the auto updater
    this.autoUpdateManager = new AutoUpdateManager(this.manifest, this.options);
    if (this.autoUpdateManager.enabled) {
      this.autoUpdateManager.init();
      this.autoUpdateManager.scheduleUpdateChecks();
    }

    // Create and set the main menu
    this.menuManager = new MainMenuManager();
    this.menuManager.create();
    this.menuManager.setDefault();
    if (this.autoUpdateManager.enabled) {
      this.menuManager.setAutoUpdaterListeners();
    }

    // Others
    this.notifManager = new NotifManager();
    this.trayManager = new TrayManager(this.mainWindowManager, this.notifManager);
    this.nativeNotifier = new NativeNotifier();
    this.autoLauncher = new AutoLauncher();

    // Listeners
    new AppListenersManager(this.mainWindowManager, this.autoUpdateManager,
      this.trayManager).set();
    new IpcListenersManager(this.notifManager, this.trayManager,
      this.mainWindowManager, this.nativeNotifier).set();
  }

}

export default Application;
