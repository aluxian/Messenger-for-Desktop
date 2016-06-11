import {app, screen, BrowserWindow} from 'electron';
import path from 'path';

import BaseNativeNotifier from 'browser/components/native-notifier/base';

/**
 * @source https://github.com/s-a/electron-toaster
 */
class Win32NativeNotifier extends BaseNativeNotifier {

  constructor (mainWindowManager) {
    super();

    this.mainWindowManager = mainWindowManager;

    // Flag that this notifier has been implemented
    this.isImplemented = true;

    // Keep track of instances
    this.notifications = {};
  }

  fireNotification ({title, body, footer, timeout, tag = title, icon, onClick, onCreate}) {
    const identifier = tag + ':::' + Date.now();
    const data = {title, body, footer, timeout, tag, onClick, onCreate, identifier};

    const currentWindow = this.mainWindowManager.window;
    if (!currentWindow) {
      logError(new Error('currentWindow not found'));
      return;
    }

    const currentWindowPos = currentWindow.getPosition();
    const display = screen.getDisplayNearestPoint({x: currentWindowPos[0], y: currentWindowPos[1]});
    let timerId;

    this.notifications[identifier] = new BrowserWindow({
      width: 300,
      height: 80,
      title,
      frame: false,
      show: false,
      skipTaskbar: true,
      alwaysOnTop: true,
      useContentSize: true,
      autoHideMenuBar: true,
      acceptFirstMouse: true,
      resizable: false
    });

    this.notifications[identifier].on('closed', () => {
      clearTimeout(timerId);
      delete this.notifications[identifier];
    });

    const animateAppearance = (width, height, callback) => {
      const fixedWidth = display.workAreaSize.width - width - 30;
      let i = 0;

      const doAnimateAppearance = () => {
        if (i < height) {
          i += Math.round(height / 10);
          timerId = setTimeout(() => {
            this.notifications[identifier].setPosition(fixedWidth, i - height + 40);
            if (i === Math.round(height / 10)) {
              this.notifications[identifier].showInactive();
            }
            doAnimateAppearance();
          }, 1);
        } else if (callback) {
          callback();
        }
      };

      doAnimateAppearance();
    };

    const htmlUrl = 'file://' + path.join(app.getAppPath(), 'html', 'shim-notification.html') + '?' + [
      'identifier=' + encodeURIComponent(identifier),
      'title=' + encodeURIComponent(title || (global.manifest.productName + ' notification')),
      'body=' + encodeURIComponent(body || 'New message.'),
      'icon=' + encodeURIComponent(icon || '../images/default_avatar.png'),
      'footer=' + encodeURIComponent(footer || global.manifest.productName),
      'timeout=' + (timeout || 5000)
    ].join('&');

    this.notifications[identifier].loadURL(htmlUrl);
    this.notifications[identifier].webContents.on('did-finish-load', () => {
      if (this.notifications[identifier]) {
        const [width, height] = this.notifications[identifier].getSize();
        animateAppearance(width, height);
      }
    });

    // this.notifications[identifier].setSize(900, 80);
    // this.notifications[identifier].openDevTools();

    // Click callback
    if (onClick) {
      this.once('shim-notif-activated-' + identifier, onClick);
    }

    // Creation callback
    if (onCreate) {
      onCreate(data);
    }
  }

  removeNotification (identifier) {
    const notifWindow = this.notifications[identifier];
    if (notifWindow) {
      notifWindow.close();
    }
  }

  onClick (identifier) {
    const payload = {
      tag: identifier.split(':::')[0],
      identifier
    };

    this.emit('shim-notif-activated-' + identifier, payload);
  }

}

export default Win32NativeNotifier;
