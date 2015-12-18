import app from 'app';
import Store from 'jfs';
import path from 'path';

const prefsPath = path.join(app.getPath('userData'), 'prefs.json');
const db = new Store(prefsPath);
const watchers = {};

/**
 * Save the given (key, value) pair asynchronously.
 * Returns immediately and logs errors.
 */
function set(key, value) {
  db.save(key, value, function(err) {
    if (err) {
      console.error(err);
    } else {
      log('set', key, '=', JSON.stringify(value));
    }
  });

  // Notify watchers
  if (Array.isArray(watchers[key])) {
    log('notifying watchers', key, value);
    for (let watcher of watchers[key]) {
      watcher(value);
    }
  }
}

/**
 * Retrieve the value synchronously.
 */
function get(key, defaultValue) {
  const value = db.getSync(key);
  if (value == undefined || value instanceof Error) {
    return defaultValue;
  }
  return value;
}

/**
 * Remove the given key.
 */
function unset(key) {
  db.delete(key, function(err) {
    if (err) {
      console.error(err);
    } else {
      log('unset', key);
    }
  });
}

/**
 * Call the callback every time the key changes.
 */
function watch(key, cb) {
  if (!Array.isArray(watchers[key])) {
    watchers[key] = [];
  }
  watchers[key].push(cb);
}

/**
 * Remove the callback from the key's watchers.
 */
function unwatch(key, cb) {
  if (Array.isArray(watchers[key])) {
    const pos = watchers[key].indexOf(cb);
    watchers[key].splice(pos, 1);
  }
}

/**
 * Remove all the keys.
 */
function clear() {
  db.all(function(err, valuesMap) {
    if (err) {
      console.error(err);
    } else {
      log('unsetting all keys');
      Object.keys(valuesMap).forEach(unset);
    }
  });
}

export default {
  set,
  get,
  unset,
  watch,
  unwatch,
  clear
};
