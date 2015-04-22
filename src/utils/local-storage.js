var localStorage = window.localStorage;

module.exports = {
  onChangeSubscribers: {},

  /**
   * Get a value from the storage.
   */
  get: function(name, defaultValue) {
    return localStorage.getItem(name) || defaultValue;
  },

  /**
   * Get a boolean value from the storage.
   */
  getBoolean: function(name) {
    return localStorage.getItem(name) == 'true';
  },

  /**
   * Set a value in the storage.
   */
  set: function(name, value) {
    localStorage.setItem(name, value);

    if (this.onChangeSubscribers[name]) {
      this.onChangeSubscribers[name](value);
    }
  },

  /**
   * Remove all the stored values.
   */
  clear: function() {
    localStorage.clear();
  },

  /**
   * Run the callback every time the given value changes.
   */
  onChanged: function(name, callback) {
    this.onChangeSubscribers[name] = callback;
  }
};
