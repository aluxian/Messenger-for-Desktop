import prefs from '../utils/prefs';

export function setLocal(localKey, valueExpr) {
  return function(item) {
    item[localKey] = valueExpr.apply(this, arguments);
  };
}

export function setPref(prefName, valueExpr) {
  return function() {
    prefs.set(prefName, valueExpr.apply(this, arguments));
  };
}

export function unsetPref(prefName) {
  return function() {
    prefs.unset(prefName);
  };
}

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
