import filePaths from './file-paths';
import path from 'path';
import fs from 'fs';

function readFile(path, callback) {
  fs.readFile(path, 'utf-8', function(err, content) {
    if (err) {
      logError(err);
    } else {
      callback(content);
    }
  });
}

export default {
  /**
   * @return the css of the theme
   */
  getThemeCss: function(theme, callback) {
    readFile(filePaths.getThemePath(theme), callback);
  },

  /**
   * @return the css of the file
   */
  getStyleCss: function(style, callback) {
    readFile(filePaths.getStylePath(style), callback);
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
