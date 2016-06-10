import {Menu} from 'electron';

export function parseTemplate (menu, parent) {
  return menu.filter((item) => {
    // Filter
    if (item.allow !== undefined && !item.allow) {
      return false;
    }

    // Run the parse-time expression
    if (item.parse) {
      item.parse.call(parent, item);
    }

    // Clean up
    delete item.parse;
    delete item.allow;

    // Parse submenu items
    if (Array.isArray(item.submenu)) {
      item.submenu = parseTemplate(item.submenu, item);
    }

    return true;
  });
}

export function findItemById (submenu, id) {
  for (let item of submenu) {
    if (item.id === id) {
      return item;
    }
    if (item.submenu) {
      const subItem = findItemById(item.submenu.items, id);
      if (subItem) {
        return subItem;
      }
    }
  }
  return null;
}

export function findMenu (menuType) {
  switch (menuType) {
    case 'main':
      return Menu.getApplicationMenu();
    case 'tray':
      return global.application.trayManager.menu;
  }
}
