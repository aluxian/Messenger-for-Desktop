import path from 'path';

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
  }
};
