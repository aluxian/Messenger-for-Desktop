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
  save: function(key, value) {
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
    return db.getSync(key) || defaultValue;
  },

  /**
   * Remove the given key.
   */
  delete: function(key) {
    return db.delete(key, function(err) {
      if (err) {
        console.error(err);
      } else {
        log('removed', key);
      }
    });
  }

};
