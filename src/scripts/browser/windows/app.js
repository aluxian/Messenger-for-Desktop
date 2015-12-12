import shell from 'shell';
import store from '../tools/store';

import BaseWindow from './base';

class AppWindow extends BaseWindow {

  constructor(manifest) {
    const bounds = store.get('window:bounds', {
      width: 800,
      height: 600
    });

    super(manifest, bounds);
    this.initWindow();
  }

  initWindow() {
    // Open urls in an external browser
    this.window.webContents.on('new-window', (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
    });

    // Save the size and position on close
    this.window.on('close', () => {
      const bounds = this.window.getBounds();
      store.save('window:bounds', bounds);
    });
  }

}

export default AppWindow;
