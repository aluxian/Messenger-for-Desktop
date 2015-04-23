var settings = require('./settings');
var fs = require('fs');

module.exports = {
  /**
   * Inject the base styles appended after the selected theme.
   */
  loadBaseStyles: function(document) {
    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    document.head.appendChild(style);

    fs.readFile('styles/base.css', 'utf-8', function(err, css) {
      if (err) {
        console.error(err);
      } else {
        style.innerText = css;
      }
    });
  },

  /**
   * Load styles in the document..
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

    updateTheme(settings.theme);
    settings.watch('theme', updateTheme);

    // Auto-Hide style
    var autoHideStyle = document.createElement('style');
    autoHideStyle.setAttribute('type', 'text/css');
    document.head.appendChild(autoHideStyle);

    fs.readFile('styles/auto-hide.css', 'utf-8', function(err, css) {
      if (err) {
        console.error(err);
      } else {
        var updateAutoHide = function(autoHide) {
          if (autoHide) {
            autoHideStyle.innerText = css;
          } else {
            autoHideStyle.innerText = '';
          }
        };

        updateAutoHide(settings.autoHideSidebar);
        settings.watch('autoHideSidebar', updateAutoHide);
      }
    });

    // Append  base style
    this.loadBaseStyles(document);
  }
};
