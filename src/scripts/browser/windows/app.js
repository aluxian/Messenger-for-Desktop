import shell from 'shell';

import BaseWindow from './base';

class AppWindow extends BaseWindow {

  constructor(manifest, options) {
    const defaults = {
      width: 800,
      height: 640
    };

    const settings = Object.assign(defaults, options);
    super(manifest, settings);

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
