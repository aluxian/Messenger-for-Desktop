import shell from 'shell';

import BaseWindow from './base';

class AppWindow extends BaseWindow {

  constructor(manifest) {
    super(manifest, {
      width: 800,
      height: 600
    });

    this.initWindow();
  }

  initWindow() {
    // Open urls in an external browser
    this.window.webContents.on('new-window', function(event, url) {
      event.preventDefault();
      shell.openExternal(url);
    });
  }

}

export default AppWindow;
