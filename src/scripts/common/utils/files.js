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

/**
 * Verify it's not a directory and the app can access it.
 * If it's invalid, purge it and write it again.
 * If it already exists, it's left untouched.
 */
async function replaceFile(filePath, writePromise) {
  try {
    await fs.accessAsync(filePath, fs.R_OK | fs.W_OK);
    const stats = await fs.lstatAsync(filePath);
    if (!stats.isFile()) {
      throw new Error();
    }
  } catch (err) {
    // err ignored
    // no access / does not exist
    try {
      await fs.removeAsync(filePath);
    } catch (err2) {
      // err2 ignored
    }
    await writePromise();
  }
}

/**
 * Check if the path exists, can be accessed and is a file.
 */
async function isFileExists(filePath) {
  try {
    await fs.accessAsync(filePath, fs.R_OK | fs.W_OK);
    const stats = await fs.lstatAsync(filePath);
    return stats.isFile();
  } catch (err) {
    return false;
  }
}

export default {
  getThemeCss,
  getStyleCss,
  getDictionariesSync,
  replaceFile,
  isFileExists
};
