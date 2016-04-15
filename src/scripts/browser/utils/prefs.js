import defaults from './prefs-defaults';
import jsonfile from 'jsonfile';
import path from 'path';
import app from 'app';

const prefsPath = path.join(app.getPath('userData'), 'prefs.json');
let data = null;

function ensureDataLoaded() {
  if (!data) {
    try {
      data = jsonfile.readFileSync(prefsPath) || {};
      log('prefs data restored');
    } catch (err) {
      if (err.code == 'ENOENT') {
        // ignored
      } else {
        logError(err);
      }
      data = {};
    }
  }
}

/**
 * Save the given (key, value) pair asynchronously.
 * Returns immediately and logs errors.
 */
function set(key, value) {
  ensureDataLoaded();
  data[key] = value;

  jsonfile.writeFile(prefsPath, data, function(err) {
    if (err) {
      logError(err);
    } else {
      log('saved', key, '=', JSON.stringify(value));
    }
  });
}

/**
 * Save the given (key, value) pair synchronously.
 * Returns immediately and logs errors.
 */
function setSync(key, value) {
  ensureDataLoaded();
  data[key] = value;

  try {
    jsonfile.writeFileSync(prefsPath, data);
    log('saved', key, '=', JSON.stringify(value));
  } catch (err) {
    logError(err);
  }
}

/**
 * Retrieve the value synchronously.
 */
function get(key) {
  ensureDataLoaded();
  const value = data[key];
  if (value === undefined) {
    const defaultValue = getDefault(key);
    if (defaultValue === undefined) {
      logFatal('default value for', key, 'is undefined');
    }
    return defaultValue;
  }
  return value;
}

/**
 * Retrieve the default value.
 */
function getDefault(key) {
  return defaults.get(key);
}

/**
 * Remove the given key asynchronously.
 */
function unset(key) {
  ensureDataLoaded();
  delete data[key];

  jsonfile.writeFile(prefsPath, data, function(err) {
    if (err) {
      logError(err);
    } else {
      log('unset', key);
    }
  });
}

/**
 * Remove the given key synchronously.
 */
function unsetSync(key) {
  ensureDataLoaded();
  delete data[key];

  try {
    jsonfile.writeFileSync(prefsPath, data);
    log('unset', key);
  } catch (err) {
    logError(err);
  }
}

/**
 * Remove all the keys and their values.
 */
function clear() {
  ensureDataLoaded();
  data = {};

  jsonfile.writeFile(prefsPath, data, function(err) {
    if (err) {
      logError(err);
    } else {
      log('all keys cleared');
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
