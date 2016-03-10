import filePaths from './file-paths';
import fs from 'fs';

export default {
  /**
   * @return the css of the theme
   */
  getThemeCss: function(theme, callback) {
    const themePath = filePaths.getThemePath(theme);
    fs.readFile(themePath, 'utf-8', function(err, css) {
      if (err) {
        logError(err);
      } else {
        callback(css);
      }
    });
  },

  /**
   * @return the css of the file
   */
  getStyleCss: function(style, callback) {
    const stylePath = filePaths.getStylePath(style);
    fs.readFile(stylePath, 'utf-8', function(err, css) {
      if (err) {
        logError(err);
      } else {
        callback(css);
      }
    });
  }
};
