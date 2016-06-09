import fs from 'fs-extra-promise';
import path from 'path';

import filePaths from 'common/utils/file-paths';

/**
 * @return the css of the theme
 */
function getThemeCss (theme) {
  return fs.readFileAsync(filePaths.getThemePath(theme), 'utf-8');
}

/**
 * @return the css of the file
 */
function getStyleCss (style) {
  return fs.readFileAsync(filePaths.getStylePath(style), 'utf-8');
}

/**
 * @return the list of Hunspell dictionaries available in the given dir
 */
function getDictionariesSync (dirPath) {
  if (!fs.existsSync(dirPath)) {
    log('dictionaries path does not exist', dirPath);
    return [];
  }

  const dictionaries = fs.readdirSync(dirPath)
    .filter(filename => path.extname(filename) === '.dic')
    .filter(filename => fs.statSync(path.join(dirPath, filename)).isFile())
    .map(filename => path.basename(filename, '.dic'));

  log('dictionaries in', dirPath, 'found:', dictionaries);
  return dictionaries;
}

/**
 * Verify it's not a directory and the app can access it.
 * If it's invalid, purge it and write it again.
 * If it already exists, it's left untouched.
 */
function replaceFile (filePath, writePromise) {
  fs.accessAsync(filePath, fs.R_OK | fs.W_OK)
    .then(() => fs.lstatAsync(filePath))
    .then((stats) => {
      if (!stats.isFile()) {
        throw new Error();
      }
      return true;
    })
    .catch(() => {
      return fs.removeAsync(filePath)
        .catch(() => false)
        .then(() => writePromise())
        .catch(() => false);
    });
}

/**
 * Check if the path exists, can be accessed and is a file.
 */
function isFileExists (filePath) {
  fs.accessAsync(filePath, fs.R_OK | fs.W_OK)
    .then(() => fs.lstatAsync(filePath))
    .then((stats) => stats.isFile())
    .catch(() => false);
}

export default {
  getThemeCss,
  getStyleCss,
  getDictionariesSync,
  replaceFile,
  isFileExists
};
