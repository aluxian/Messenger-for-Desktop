import app from 'app';
import Store from 'jfs';
import path from 'path';
import debug from 'debug';

const log = debug('whatsie:prefs');
const prefsPath = path.join(app.getPath('userData'), 'prefs.json');
const db = new Store(prefsPath);

export default {

  /**
   * Save the given (key, value) pair asynchronously.
   * Return immediately and log errors.
   */
  set: function(key, value) {
    return db.save(key, value, function(err) {
      if (err) {
        console.error(err);
      } else {
        log('saved', key, '=', JSON.stringify(value));
      }
    });
  },

  /**
   * Retrieve the value synchronously.
   */
  get: function(key, defaultValue) {
    const value = db.getSync(key) || defaultValue;
    if (value instanceof Error) {
      return defaultValue;
    }
    return value;
  },

  /**
   * Remove the given key.
   */
  unset: function(key) {
    return db.delete(key, function(err) {
      if (err) {
        console.error(err);
      } else {
        log('removed', key);
      }
    });
  }

};
