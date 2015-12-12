import shell from 'shell';
import prefs from '../tools/prefs';
import {debounce} from 'lodash';
import debug from 'debug';

import BaseWindow from './base';

const log = debug('whatsie:AppWindow');

class AppWindow extends BaseWindow {

  constructor(manifest) {
    log('creating AppWindow');
    const bounds = prefs.get('window:bounds', {
      width: 800,
      height: 600
    });

    const options = {
      title: manifest.productName
    };

    super(manifest, Object.assign(options, bounds));
    this.initWindow();
  }

  initWindow() {
    // Open urls in an external browser
    this.window.webContents.on('new-window', (event, url) => {
      log('opening url externally', url);
      event.preventDefault();
      shell.openExternal(url);
    });

    // Apply the saved theme
    this.window.webContents.on('dom-ready', () => {
      const theme = prefs.get('app:theme', null);
      if (theme) {
        log('restoring theme', theme);
        const js = 'applyTheme("' + theme + '");';
        this.window.webContents.executeJavaScript(js);
      }
    });

    // Listen to window title changes
    this.window.on('page-title-updated', (event) => {
      log('window title updated', this.window.getTitle());
    });

    // Save the bounds on resize or move
    const saveBounds = debounce(::this.saveBounds, 1000);
    this.window.on('resize', saveBounds);
    this.window.on('move', saveBounds);
  }

  saveBounds() {
    log('saving bounds');
    const bounds = this.window.getBounds();
    prefs.save('window:bounds', bounds);
  }

}

export default AppWindow;
