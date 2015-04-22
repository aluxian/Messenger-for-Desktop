var gui = window.require('nw.gui');
var platform = require('./platform');
var localStorage = require('./local-storage');

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
    var submenu = menu.items[0].submenu;

    submenu.insert(new gui.MenuItem({
      type: 'separator'
    }), 1);

    submenu.insert(new gui.MenuItem({
      type: 'checkbox',
      label: 'Dark Theme',
      checked: localStorage.get('theme') == 'dark',
      click: function() {
        localStorage.set('theme', this.checked ? 'dark' : 'default');
      }
    }), 2);

    submenu.insert(new gui.MenuItem({
      type: 'separator'
    }), 3);

    submenu.insert(new gui.MenuItem({
      label: 'Launch Dev Tools',
      click: function() {
        win.showDevTools();
      }
    }), 4);

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
