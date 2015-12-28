import prefs from '../../utils/prefs';
import files from '../../utils/files';

// Temporary store
const memoStore = {};

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
 * If valueExpr is given, it stores the value in a local object.
 * Otherwise, it retrives the stored value for the key.
 */
export function memo(keyName, valueExpr) {
  return function() {
    if (valueExpr) {
      memoStore[keyName] = valueExpr.apply(this, arguments);
    } else {
      return memoStore[keyName];
    }
  };
}

/**
 * Removes the key from the locally stored values object.
 */
export function unmemo(keyName) {
  return function() {
    delete memoStore[keyName];
  };
}

/**
 * Gets the css content of the given theme.
 */
export function themeCss(nameExpr, callback) {
  return function() {
    const theme = nameExpr.apply(this, arguments);
    files.getThemeCss(theme, css => {
      callback(css).apply(this, arguments);
    });
  };
}
