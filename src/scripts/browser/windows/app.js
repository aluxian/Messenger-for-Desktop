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
      title: manifest.productName,
      backgroundColor: '#dfdfdf'
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
        this.window.webContents.send('apply-theme', theme);
      }
    });

    // Save the bounds on resize or move
    const saveBounds = debounce(::this.saveBounds, 500);
    this.window.on('resize', saveBounds);
    this.window.on('move', saveBounds);
  }

  /**
   * Persist the current window's state.
   */
  saveBounds() {
    log('saving bounds');
    const bounds = this.window.getBounds();
    prefs.save('window:bounds', bounds);
  }

}

export default AppWindow;
