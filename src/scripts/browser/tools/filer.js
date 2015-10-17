import path from 'path';

export default {
  /**
   * Get the path of the html file.
   */
  getHtmlPath: function(name) {
    return path.resolve(__dirname, '..', '..', '..', 'html', name);
  },

  /**
   * Get the path of the html file, prepended with the file:// protocol.
   */
  getHtmlFile: function(name) {
    return 'file://' + this.getHtmlPath(name);
  }
};
