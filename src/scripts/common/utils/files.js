import fs from 'fs-extra-promise';
import path from 'path';

import filePaths from 'common/utils/file-paths';

/**
 * @return the css of the theme
 */
async function getThemeCss(theme) {
  return await fs.readFileAsync(filePaths.getThemePath(theme), 'utf-8');
}

/**
 * @return the css of the file
 */
async function getStyleCss(style) {
  return await fs.readFileAsync(filePaths.getStylePath(style), 'utf-8');
}

/**
 * @return the list of Hunspell dictionaries available in the given dir
 */
function getDictionariesSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    log('dictionaries path does not exist', dirPath);
    return [];
  }

  const dictionaries = fs.readdirSync(dirPath)
    .filter(filename => path.extname(filename) == '.dic')
    .filter(filename => fs.statSync(path.join(dirPath, filename)).isFile())
    .map(filename => path.basename(filename, '.dic'));

  log('dictionaries in', dirPath, 'found:', dictionaries);
  return dictionaries;
}

export default {
  getThemeCss,
  getStyleCss,
  getDictionariesSync
};
