var gui = window.require('nw.gui');
var platform = require('./platform');

module.exports = {
  /**
   * Create the menu bar for the given window, only on OS X.
   */
  loadMenuBar: function(win) {
    if (!platform.isOSX) {
      return;
    }

    var menu = new gui.Menu({
      type: 'menubar'
    });

    menu.createMacBuiltin('Messenger');
    // add the rest

    win.menu = menu;
  },

  /**
   * Create the menu for the tray icon.
   */
  createTrayMenu: function(win) {
    var menu = new gui.Menu();

    menu.append(new gui.MenuItem({
      label: 'Open Messenger',
      click: function() {
        win.show();
        win.focus();
      }
    }));

    menu.append(new gui.MenuItem({
      label: 'Quit Messenger',
      click: function() {
        win.close(true);
      }
    }));

    return menu;
  },

  /**
   * Create the tray icon for Windows and Linux.
   */
  loadTrayIcon: function(win) {
    if (!(platform.isWindows || platform.isLinux)) {
      return;
    }

    var tray = new gui.Tray({
      title: 'Messenger',
      tooltip: 'Messenger for Desktop',
      icon: 'icon.png'
    });

    tray.on('click', function() {
      win.show();
      win.focus();
    });

    tray.menu = this.createTrayMenu(win);
  }
};
