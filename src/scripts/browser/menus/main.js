import {parseTemplate} from './utils';

const template = [
  './templates/main-app-darwin',
  './templates/main-app-nondarwin',
  './templates/main-edit',
  './templates/main-view',
  './templates/main-theme',
  './templates/main-window',
  './templates/main-help'
].map(p => require(p).default);

function parseTemplate(menu, parent) {
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

export default parseTemplate(template, null);
