var localStorage = require('./local-storage');
var fs = require('fs');

module.exports = {
  /**
   * Inject the base styles appended after the selected theme.
   */
  loadBaseStyles: function(document) {
    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    document.head.appendChild(style);

    fs.readFile('themes/base.css', 'utf-8', function(err, css) {
      if (err) {
        console.error(err);
      } else {
        style.innerText = css;
      }
    });
  },

  /**
   * Load the default theme and change it when required.
   */
  apply: function(document) {
    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    document.head.appendChild(style);

    var updateTheme = function(theme) {
      fs.readFile('themes/' + theme + '.css', 'utf-8', function(err, css) {
        if (err) {
          console.error(err);
        } else {
          style.innerText = css;
        }
      });
    };

    updateTheme(localStorage(window).get('theme', 'default'));
    localStorage(window).onChanged('theme', updateTheme);

    this.loadBaseStyles(document);
  }
};
