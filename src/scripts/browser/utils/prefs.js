import app from 'app';
import Store from 'jfs';
import path from 'path';
import debug from 'debug';

const log = debug('whatsie:prefs');
const prefsPath = path.join(app.getPath('userData'), 'prefs.json');
const db = new Store(prefsPath);

/**
 * Save the given (key, value) pair asynchronously.
 * Return immediately and log errors.
 */
function set(key, value) {
  return db.save(key, value, function(err) {
    if (err) {
      console.error(err);
    } else {
      log('saved', key, '=', JSON.stringify(value));
    }
  });
}

/**
 * Retrieve the value synchronously.
 */
function get(key, defaultValue) {
  const value = db.getSync(key) || defaultValue;
  if (value instanceof Error) {
    return defaultValue;
  }
  return value;
}

/**
 * Remove the given key.
 */
function unset(key) {
  return db.delete(key, function(err) {
    if (err) {
      console.error(err);
    } else {
      log('removed', key);
    }
  });
}

export default {
  set,
  get,
  unset
};
