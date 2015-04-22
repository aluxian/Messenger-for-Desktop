var localStorage = require('./local-storage');
var fs = require('fs');

module.exports = {
  /**
   * Load the default theme and change it when required.
   */
  apply: function(document) {
    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    document.head.appendChild(style);

    var updateTheme = function(theme) {
      fs.readFile('themes/' + theme + '.css', 'utf-8', function(err, css) {
        if (!err) {
          style.innerText = css;
        }
      });
    };

    updateTheme(localStorage.get('theme', 'default'));
    localStorage.onChanged('theme', updateTheme);
  }
};
