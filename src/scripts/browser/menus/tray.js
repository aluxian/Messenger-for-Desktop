import {parseTemplate} from 'browser/menus/utils';

export default function () {
  const template = require('browser/menus/templates/tray').default;
  return parseTemplate(template, null);
}
