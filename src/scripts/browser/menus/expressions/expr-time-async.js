import prefs from '../../utils/prefs';
import debug from 'debug';
const log = debug('whatsie:expr-common');

/**
 * Set a watcher on the given pref key.
 * TODO: memory leak, should unwatch when the menu is destroyed
 */
export function watchPref(prefKey, getExprs) {
  return function(findMenuItem) {
    prefs.watch(prefKey, newValue => {
      findMenuItem((menuItem, browserWindow) => {
        const exprs = getExprs(newValue);
        for (let expr of exprs) {
          expr.apply(this, arguments);
        }
      });
    });
  };
}
