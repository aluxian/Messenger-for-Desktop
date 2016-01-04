export function P(darwin, linux, win) {
  switch (process.platform) {
    case 'darwin': return darwin;
    case 'linux': return linux || darwin;
    case 'win32': return win || linux || darwin;
  }
}

export function parseTemplate(menu, parent) {
  return menu.filter(item => {
    // Filter by platform
    if (item.allow !== undefined && !item.allow) {
      return false;
    }

    // Run the parse-time expression
    if (item.parse) {
      item.parse.call(parent, item);
    }

    // Clean up
    delete item.parse;
    delete item.allow;

    // Parse submenu items
    if (Array.isArray(item.submenu)) {
      item.submenu = parseTemplate(item.submenu, item);
    }

    return true;
  });
}
