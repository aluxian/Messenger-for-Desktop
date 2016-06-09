import app from 'common/electron/app';
import path from 'path';

/**
 * @return the theme's css path
 */
function getThemePath (name) {
  return path.join(app.getAppPath(), 'themes', name + '.css');
}

/**
 * @return the style's css path
 */
function getStylePath (name) {
  return path.join(app.getAppPath(), 'styles', name + '.css');
}

/**
 * @return the image's path
 */
function getImagePath (name) {
  return path.join(app.getAppPath(), 'images', name);
}

/**
 * Windows only.
 * @return the directory where the app is ran from
 */
function getCustomUserDataPath () {
  return path.join(path.dirname(app.getPath('exe')), 'data');
}

/**
 * Windows only.
 * @return the path to Update.exe created by Squirrel.Windows
 */
function getSquirrelUpdateExePath () {
  return path.join(path.dirname(app.getPath('exe')), '..', 'Update.exe');
}

export default {
  getThemePath,
  getStylePath,
  getImagePath,
  getCustomUserDataPath,
  getSquirrelUpdateExePath
};
