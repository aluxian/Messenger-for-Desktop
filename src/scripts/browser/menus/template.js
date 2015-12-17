let template = [
  require('./menu-app').default,
  require('./menu-settings').default,
  require('./menu-edit').default,
  require('./menu-view').default,
  require('./menu-theme').default,
  require('./menu-window').default,
  require('./menu-help').default
];

template = (function parseTemplate(menu, parent) {
  return menu.filter(item => {
    // Filter by platform
    if (item.platform !== undefined && !item.platform) {
      return false;
    }

    // Run parse-time expression
    if (item.parse) {
      item.parse.call(parent, item);
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
