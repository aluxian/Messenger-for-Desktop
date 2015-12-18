import prefs from '../../utils/prefs';

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
export function pref(prefName, defaultValueExpr) {
  return function() {
    let defaultValue = undefined;
    if (defaultValueExpr) {
      defaultValue = defaultValueExpr.apply(this, arguments);
    }
    return prefs.get(prefName, defaultValue);
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
