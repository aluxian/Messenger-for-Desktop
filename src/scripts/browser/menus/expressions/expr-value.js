import prefs from 'browser/utils/prefs';

/**
 * Wrapper for a raw value.
 */
export function val (value) {
  return function () {
    return value;
  };
}

/**
 * Returns the given key's value from the item.
 */
export function key (localKey) {
  return function (item) {
    return item[localKey];
  };
}

/**
 * Returns the pref value for the given key.
 */
export function pref (prefName) {
  return function () {
    return prefs.get(prefName);
  };
}
