import defaults from './prefs-defaults';
import Store from 'jfs';
import path from 'path';
import app from 'app';

const prefsPath = path.join(app.getPath('userData'), 'prefs.json');
const db = new Store(prefsPath);

/**
 * Save the given (key, value) pair asynchronously.
 * Returns immediately and logs errors.
 */
function set(key, value) {
  db.save(key, value, function(err) {
    if (err) {
      logError(err);
    } else {
      log('set', key, '=', JSON.stringify(value));
    }
  });
}

/**
 * Save the given (key, value) pair synchronously.
 * Returns immediately and logs errors.
 */
function setSync(key, value) {
  try {
    db.saveSync(key, value);
    log('set', key, '=', JSON.stringify(value));
  } catch (ex) {
    logError(ex);
  }
}

/**
 * Retrieve the value synchronously.
 */
function get(key) {
  const value = db.getSync(key);
  if (value == undefined || value instanceof Error) {
    const defaultValue = getDefault(key);
    if (defaultValue === undefined) {
      logFatal('default value for', key, 'is undefined');
    }
    return defaultValue;
  }
  return value;
}

/**
 * Retrieve the value value.
 */
function getDefault(key) {
  return defaults.get(key);
}

/**
 * Remove the given key asynchronously.
 */
function unset(key) {
  db.delete(key, function(err) {
    if (err) {
      if (err.message && err.message.includes('not found')) {
        // ignore
      } else {
        logError(err);
      }
    } else {
      log('unset', key);
    }
  });
}

/**
 * Remove the given key synchronously.
 */
function unsetSync(key) {
  try {
    db.delete(key);
    log('unset', key);
  } catch (ex) {
    if (ex.message && ex.message.includes('not found')) {
      // ignore
    } else {
      logError(ex);
    }
  }
}

/**
 * Remove all the keys.
 */
function clear() {
  db.all(function(err, valuesMap) {
    if (err) {
      logError(err);
    } else {
      log('unsetting all keys');
      Object.keys(valuesMap).forEach(unset);
    }
  });
}

export default {
  set,
  setSync,
  get,
  getDefault,
  unset,
  unsetSync,
  clear
};
