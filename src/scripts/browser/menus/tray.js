import {parseTemplate} from './utils';

export default function() {
  const template = require('./templates/tray').default;
  return parseTemplate(template, null);
}
