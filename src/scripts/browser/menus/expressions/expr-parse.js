import {BrowserWindow} from 'electron';

import {findItemById, findMenu} from 'browser/menus/utils';
import prefs from 'browser/utils/prefs';

/**
 * Set a key of the item with the given value.
 */
export function setLocal (localKey, valueExpr) {
  return function (item) {
    item[localKey] = valueExpr.apply(this, arguments);
  };
}

/**
 * Sets a preference key.
 */
export function setPref (prefName, valueExpr) {
  return function () {
    prefs.set(prefName, valueExpr.apply(this, arguments));
  };
}

/**
 * Unsets a preference key.
 */
export function unsetPref (prefName) {
  return function () {
    prefs.unset(prefName);
  };
}

/**
 * Updates the value of a sibling item's key.
 */
export function updateSibling (siblingId, siblingKey, valueExpr) {
  return function (item) {
    const submenu = (this && this.submenu) || (item && item.menu && item.menu.items);
    if (submenu) {
      const sibling = submenu.find((i) => i.id === siblingId);
      if (sibling) {
        sibling[siblingKey] = valueExpr.apply(this, arguments);
      }
    }
  };
}

/**
 * Update an item from another menu.
 */
export function updateMenuItem (menuType, itemId) {
  return function (...valueExprs) {
    return function (exprCallback) {
      return function () {
        const menu = findMenu(menuType);
        if (!menu) {
          return log('menu not found', menuType);
        }

        const menuItem = findItemById(menu.items, itemId);
        if (!menuItem) {
          return log('menu item not found', itemId);
        }

        const values = valueExprs.map((e) => e.apply(this, arguments));
        const expr = exprCallback(...values);
        const browserWindow = BrowserWindow.getFocusedWindow();
        expr.call(global, menuItem, browserWindow);
      };
    };
  };
}
