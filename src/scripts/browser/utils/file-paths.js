import platform from './platform';
import path from 'path';
import app from 'app';

export default {
  /**
   * @return the path of the html file
   */
  getHtmlPath: function(name) {
    return path.resolve(__dirname, '..', '..', '..', 'html', name);
  },

  /**
   * @return the path of the html file, prepended with the file:// protocol
   */
  getHtmlFile: function(name) {
    return 'file://' + this.getHtmlPath(name);
  },

  /**
   * @return the theme's css path
   */
  getThemePath: function(name) {
    return path.resolve(__dirname, '..', '..', '..', 'themes', name + '.css');
  },

  /**
   * @return the style's css path
   */
  getStylePath: function(name) {
    return path.resolve(__dirname, '..', '..', '..', 'styles', name + '.css');
  },

  /**
   * @return the image's path
   */
  getImagePath: function(name) {
    return path.resolve(__dirname, '..', '..', '..', 'images', name);
  },

  /**
   * On Darwin: the path to the .app
   * On Windows: the path to the dir of Whatsie.exe
   * On Linux: the path to the dir of whatsie (the exec)
   * @return the directory where the app is ran from
   */
  getAppDir: function() {
    const exeDir = path.dirname(app.getPath('exe'));
    if (platform.isDarwin) {
      return path.join(exeDir, '..', '..');
    } else {
      return exeDir;
    }
  }
};
