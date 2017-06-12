export default function () {
  const template = [
    'browser/menus/templates/main-app',
    'browser/menus/templates/main-edit',
    'browser/menus/templates/main-view',
    'browser/menus/templates/main-bots',
    'browser/menus/templates/main-theme',
    'browser/menus/templates/main-privacy',
    'browser/menus/templates/main-window',
    'browser/menus/templates/main-help'
  ].map((module) => require(module).default);
  return template;
}
