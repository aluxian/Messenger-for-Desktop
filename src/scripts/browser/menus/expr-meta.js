export function all() {
  const functions = arguments;
  return function() {
    functions.forEach(fn => fn.apply(this, arguments));
  };
}

export function custom(fn) {
  return function() {
    fn.apply(this, arguments);
  };
}
