import prefs from '../../utils/prefs';

/**
 * Set a watcher on the given pref key.
 * TODO: memory leak, should unwatch when the menu is destroyed
 */
export function watchPref(prefKey, getExprs) {
  return function(findMenuItem) {
    prefs.watch(prefKey, newValue => {
      findMenuItem(() => {
        const exprs = getExprs(newValue);
        for (let expr of exprs) {
          expr.apply(this, arguments);
        }
      });
    });
  };
}
