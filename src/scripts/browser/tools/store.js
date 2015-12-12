import app from 'app';
import Store from 'jfs';
import path from 'path';

const prefsPath = path.join(app.getPath('userData'), 'prefs.json');
const db = new Store(prefsPath);

export default {

  save: function(key, value) {
    db.save(key, value, function(err) {
      if (err) {
        console.error(err);
      }
    });
  },

  get: function(key, defaultValue) {
    return db.getSync(key) || defaultValue;
  }

};
