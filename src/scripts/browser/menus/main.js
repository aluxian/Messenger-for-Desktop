import {parseTemplate} from './utils';

const template = [
  require('./templates/main-app').default,
  require('./templates/main-settings').default,
  require('./templates/main-edit').default,
  require('./templates/main-view').default,
  require('./templates/main-theme').default,
  require('./templates/main-window').default,
  require('./templates/main-help').default
];

export default parseTemplate(template, null);
