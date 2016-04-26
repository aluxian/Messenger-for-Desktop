import prefs from 'browser/utils/prefs';
import files from 'common/utils/files';

/**
 * Wrapper for a raw value.
 */
export function val(value) {
  return function() {
    return value;
  };
}

/**
 * Returns the given key's value from the item.
 */
export function key(localKey) {
  return function(item) {
    return item[localKey];
  };
}

/**
 * Returns the pref value for the given key.
 */
export function pref(prefName) {
  return function() {
    return prefs.get(prefName);
  };
}

/**
 * Sums up two expressions.
 */
export function sum(value1Expr, value2Expr) {
  return function() {
    return value1Expr.apply(this, arguments) + value2Expr.apply(this, arguments);
  };
}

/**
 * Checks 2 expressions for equality.
 */
export function eq(value1Expr, value2Expr) {
  return function() {
    return value1Expr.apply(this, arguments) === value2Expr.apply(this, arguments);
  };
}

/**
 * Gets the css content of the given theme.
 */
export function themeCss(nameExpr, callback) {
  return function() {
    const theme = nameExpr.apply(this, arguments);
    files.getThemeCss(theme)
      .then(css => callback(css).apply(this, arguments))
      .catch(logError);
  };
}
