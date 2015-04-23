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
      checked: localStorage(window).get('theme') == 'dark',
      click: function() {
        localStorage(window).set('theme', this.checked ? 'dark' : 'default');
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
      icon: 'icon.png'
    });

    tray.on('click', function() {
      win.show();
      win.focus();
    });

    tray.tooltip = 'Messenger for Desktop';
    tray.menu = this.createTrayMenu(win);

    // keep the object in memory
    win.tray = tray;
  },

  /**
   * Create a context menu for the window and document.
   */
  createContextMenu: function(win, window, document, event) {
    var menu = new gui.Menu();

    menu.append(new gui.MenuItem({
      label: 'Reload',
      click: function() {
        win.reload();
      }
    }));

    if (event.currentTarget.type == 'input') {
      menu.append(new gui.MenuItem({
        type: 'separator'
      }));

      menu.append(new gui.MenuItem({
        label: "Cut",
        click: function() {
          document.execCommand("cut");
        }
      }));

      menu.append(new gui.MenuItem({
        label: "Copy",
        click: function() {
          document.execCommand("copy");
        }
      }));

      menu.append(new gui.MenuItem({
        label: "Paste",
        click: function() {
          document.execCommand("paste");
        }
      }));
    } /*else if (event.currentTarget.type == 'a') {
      menu.append(new gui.MenuItem({
        type: 'separator'
      }));

      menu.append(new gui.MenuItem({
        label: "Copy Link",
        click: function() {
          document.execCommand("copy");
        }
      }));
    } */else if (window.getSelection().toString().length > 0) {
      menu.append(new gui.MenuItem({
        type: 'separator'
      }));

      menu.append(new gui.MenuItem({
        label: "Copy",
        click: function() {
          document.execCommand("copy");
        }
      }));
    }

    return menu;
  },

  /**
   * Listen for right clicks and show a context menu.
   */
  injectContextMenu: function(win, window, document) {
    document.body.addEventListener('contextmenu', function(event) {
      event.preventDefault();
      this.createContextMenu(win, window, document, event).popup(event.x, event.y);
      return false;
    }.bind(this));
  }
};
