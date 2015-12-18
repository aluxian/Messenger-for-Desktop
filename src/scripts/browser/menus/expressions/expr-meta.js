/**
 * Run all the given expressions, serially.
 */
export function all(...exprs) {
  return function() {
    for (let expr of exprs) {
      expr.apply(this, arguments);
    }
  };
}

/**
 * The equivalent of an 'if' statement.
 */
export function iff(condExpr, trueExpr, falseExpr) {
  return function() {
    const cond = condExpr.apply(this, arguments);
    if (cond) {
      trueExpr.apply(this, arguments);
    } else {
      falseExpr.apply(this, arguments);
    }
  };
}

/**
 * Runs a custom function.
 */
export function custom(fn) {
  return function() {
    fn.apply(this, arguments);
  };
}
