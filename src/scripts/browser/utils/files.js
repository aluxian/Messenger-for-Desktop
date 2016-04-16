import filePaths from './file-paths';
import path from 'path';
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
  },

  /**
   * @return the list of Hunspell dictionaries available in the given dir
   */
  getDictionariesSync: function(dirPath) {
    if (!fs.existsSync(dirPath)) {
      log('dictionaries path does not exist');
      return [];
    }

    const dictionaries = fs.readdirSync(dirPath)
      .filter(filename => path.extname(filename) == '.dic')
      .filter(filename => fs.statSync(path.join(dirPath, filename)).isFile())
      .map(filename => path.basename(filename, '.dic'));

    log('dictionaries in', dirPath, 'found:', dictionaries);
    return dictionaries;
  }
};
