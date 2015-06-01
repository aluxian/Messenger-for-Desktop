var callbacks = {};
var queue = [];

setInterval(function() {
  while (queue.length) {
    var event = queue[0][0];
    var data = queue[0][1];

    callbacks[event].forEach(function(callback) {
      callback(data);
    });

    queue.splice(0, 1);
  }
}, 100);

/**
 * Like an EventEmitter, but runs differently. Workaround for dialog crashes. Singleton.
 */
module.exports = {
  addEventListener: function(event, callback) {
    if (!callbacks[event]) {
      callbacks[event] = [];
    }

    callbacks[event].push(callback);
  },

  removeAllListeners: function(event) {
    callbacks[event] = [];
  },

  trigger: function(event, data) {
    queue.push([event, data]);
  }
};
