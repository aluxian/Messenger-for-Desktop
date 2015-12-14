import prefs from '../utils/prefs';

const memoStore = {};

export function val(value) {
  return function() {
    return value;
  };
}

export function key(localKey) {
  return function(item) {
    return item[localKey];
  };
}

export function pref(prefName, defaultValueExpr) {
  return function() {
    let defaultValue = undefined;
    if (defaultValueExpr) {
      defaultValue = defaultValueExpr.apply(this, arguments);
    }
    return prefs.get(prefName, defaultValue);
  };
}

export function sum(value1Expr, value2Expr) {
  return function() {
    return value1Expr.apply(this, arguments) + value2Expr.apply(this, arguments);
  };
}

export function eq(value1Expr, value2Expr) {
  return function() {
    return value1Expr.apply(this, arguments) === value2Expr.apply(this, arguments);
  };
}

export function memoVal(keyName, valueExpr) {
  return function() {
    if (valueExpr) {
      memoStore[keyName] = valueExpr.apply(this, arguments);
    } else {
      return memoStore[keyName];
    }
  };
}

export function unmemoVal(keyName) {
  return function() {
    delete memoStore[keyName];
  };
}
