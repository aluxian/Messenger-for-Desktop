/**
 * Updates the value of a sibling item's key.
 */
export function updateSibling(siblingId, siblingKey, valueExpr) {
  return function(item) {
    const submenu = (this && this.submenu) || (item && item.menu && item.menu.items);
    if (submenu) {
      const sibling = submenu.find(i => i.id === siblingId);
      if (sibling) {
        sibling[siblingKey] = valueExpr.apply(this, arguments);
      }
    }
  };
}
