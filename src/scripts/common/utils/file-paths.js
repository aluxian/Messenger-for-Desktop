import path from 'path';
import app from 'common/electron/app';

import platform from 'common/utils/platform';

/**
 * @return the path of the html file
 */
function getHtmlPath(name) {
  return path.join(app.getAppPath(), 'html', name);
}

/**
 * @return the path of the html file, prepended with the file:// protocol
 */
function getHtmlFile(name) {
  return 'file://' + getHtmlPath(name);
}

/**
 * @return the theme's css path
 */
function getThemePath(name) {
  return path.join(app.getAppPath(), 'themes', name + '.css');
}

/**
 * @return the style's css path
 */
function getStylePath(name) {
  return path.join(app.getAppPath(), 'styles', name + '.css');
}

/**
 * @return the image's path
 */
function getImagePath(name) {
  return path.join(app.getAppPath(), 'images', name);
}

/**
 * On Darwin: the path to the Resources folder
 * On Windows: the path to the dir of the app executable
 * On Linux: the path to the dir of the app executable
 * @return the directory where the app is ran from
 */
function getAppDirPath() {
  const exeDir = path.dirname(app.getPath('exe'));
  if (platform.isDarwin) {
    return path.join(exeDir, '..', '..', 'Resources');
  } else {
    return exeDir;
  }
}

/**
 * @return the path to Update.exe created by Squirrel.Windows
 */
function getSquirrelUpdateExePath() {
  return path.join(getAppDirPath(), '..', 'Update.exe');
}

export default {
  getHtmlPath,
  getHtmlFile,
  getThemePath,
  getStylePath,
  getImagePath,
  getAppDirPath,
  getSquirrelUpdateExePath
};
