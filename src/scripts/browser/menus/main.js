import {parseTemplate} from 'browser/menus/utils';

export default function () {
  const template = [
    'browser/menus/templates/main-app-darwin',
    'browser/menus/templates/main-app-nondarwin',
    'browser/menus/templates/main-edit',
    'browser/menus/templates/main-view',
    'browser/menus/templates/main-theme',
    'browser/menus/templates/main-window-darwin',
    'browser/menus/templates/main-window-nondarwin',
    'browser/menus/templates/main-help'
  ].map((module) => require(module).default);
  return parseTemplate(template, null);
}
