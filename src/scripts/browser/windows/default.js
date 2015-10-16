import shell from 'shell';

import BaseWindow from './base';

class DefaultWindow extends BaseWindow {

  createBrowserWindow(settings) {
    const browserWindow = super(settings);

    // Open urls in an external browser
    browserWindow.webContents.on('new-window', function(event, url) {
      event.preventDefault();
      shell.openExternal(url);
    });

    // Remove Whatsie and Electron from the UserAgent
    const userAgent = browserWindow.webContents.getUserAgent();
    console.log(userAgent);

    return browserWindow;
  }

}

export default DefaultWindow;
