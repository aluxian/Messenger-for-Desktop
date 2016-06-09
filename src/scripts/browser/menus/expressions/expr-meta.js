/**
 * Run all the given expressions, serially.
 */
export function all (...exprs) {
  return function () {
    for (let expr of exprs) {
      expr.apply(this, arguments);
    }
  };
}

/**
 * The equivalent of an 'if' statement.
 */
export function ifTrue (condExpr, trueExpr, falseExpr) {
  return function () {
    const cond = condExpr.apply(this, arguments);
    if (cond) {
      if (trueExpr) {
        trueExpr.apply(this, arguments);
      }
    } else if (falseExpr) {
      falseExpr.apply(this, arguments);
    }
  };
}

/**
 * Runs a custom function.
 */
export function custom (fn) {
  return function () {
    fn.apply(this, arguments);
  };
}
