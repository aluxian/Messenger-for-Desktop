import prefs from '../../utils/prefs';
import {findItemById, findMenu} from './utils';

import BrowserWindow from 'browser-window';

/**
 * Set a key of the item with the given value.
 */
export function setLocal(localKey, valueExpr) {
  return function(item) {
    item[localKey] = valueExpr.apply(this, arguments);
  };
}

/**
 * Sets a preference key.
 */
export function setPref(prefName, valueExpr) {
  return function(item) {
    prefs.set(prefName, valueExpr.apply(this, arguments));
  };
}

/**
 * Unsets a preference key.
 */
export function unsetPref(prefName) {
  return function(item) {
    prefs.unset(prefName);
  };
}

/**
 * Runs the given expressions, but called with a real menuItem instead of a template.
 */
export function menu(menuType = 'main') {
  return function(...exprs) {
    return function(item) {
      if (!item.id) {
        return log('item.id is required');
      }

      for (let expr of exprs) {
        expr.call(global, cb => {
          const menu = findMenu(menuType);
          if (!menu) {
            return log('menu not found', menuType);
          }

          const menuItem = findItemById(menu.items, item.id);
          if (!menuItem) {
            return log('menu item not found', item.id);
          }

          const browserWindow = BrowserWindow.getFocusedWindow();
          cb(menuItem, browserWindow);
        });
      }
    };
  };
}
