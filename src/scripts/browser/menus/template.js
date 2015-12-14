const template = [
  require('./menu-app'),
  require('./menu-settings'),
  require('./menu-edit'),
  require('./menu-view'),
  require('./menu-theme'),
  require('./menu-window'),
  require('./menu-help')
];

template = (function parseTemplate(menu, parent) {
  return menu.filter(item => {
    // Filter by platform
    if (item.platform !== undefined && !item.platform) {
      return false;
    }

    // Run parse-time expression
    if (item.parse) {
      item.parse(item).bind(parent);
    }

    // Clean up
    delete item.platform;

    // Parse submenu items
    if (Array.isArray(item.submenu)) {
      item.submenu = parseTemplate(item.submenu, item);
    }

    return true;
  });
})(template, null);

export default template;
