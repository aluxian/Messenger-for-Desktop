module.exports = function(window) {
  var storage = window.localStorage;

  return {
    onChangeSubscribers: {},

    /**
     * Get a value from the storage.
     */
    get: function(name, defaultValue) {
      return storage.getItem(name) || defaultValue;
    },

    /**
     * Get a boolean value from the storage.
     */
    getBoolean: function(name) {
      return storage.getItem(name) == 'true';
    },

    /**
     * Set a value in the storage.
     */
    set: function(name, value) {
      storage.setItem(name, value);

      if (this.onChangeSubscribers[name]) {
        this.onChangeSubscribers[name](value);
      }
    },

    /**
     * Remove all the stored values.
     */
    clear: function() {
      storage.clear();
    },

    /**
     * Run the callback every time the given value changes.
     */
    onChanged: function(name, callback) {
      this.onChangeSubscribers[name] = callback;
    }
  };
};
