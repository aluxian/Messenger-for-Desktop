export function findItemByLabel (submenu, label) {
  for (let item of submenu) {
    if (item.label === label) {
      return item;
    }

    if (item.submenu) {
      const subItem = findItemByLabel(item.submenu.items, label);
      if (subItem) {
        return subItem;
      }
    }
  }

  return null;
}
