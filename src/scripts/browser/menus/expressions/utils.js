import Menu from 'menu';

export function findItemById(submenu, id) {
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

export function findMenu(menuType) {
  switch (menuType) {
    case 'main':
      return Menu.getApplicationMenu();
    case 'tray':
      return global.application.trayManager.tray;
  }
}
