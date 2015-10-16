import path from 'path';

export default {
  getHtmlPath: function(name) {
    return path.resolve(__dirname, '..', '..', '..', 'html', name);
  },

  getHtmlFile: function(name) {
    return 'file://' + this.getHtmlPath(name);
  }
};
