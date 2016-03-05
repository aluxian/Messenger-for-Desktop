import {parseTemplate} from './utils';

export default function() {
  const template = [
    './templates/main-app-darwin',
    './templates/main-app-nondarwin',
    './templates/main-edit',
    './templates/main-view',
    './templates/main-theme',
    './templates/main-window',
    './templates/main-help'
  ].map(p => require(p).default);
  return parseTemplate(template, null);
}
