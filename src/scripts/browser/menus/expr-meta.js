export function all() {
  const exprs = Array.from(arguments);
  return function() {
    exprs.forEach(expr => expr.apply(this, arguments));
  };
}

export function custom(fn) {
  return function() {
    fn.apply(this, arguments);
  };
}
