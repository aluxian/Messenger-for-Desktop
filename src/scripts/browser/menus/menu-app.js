import manifest from '../../../package.json';
import $ from './expr';

export default {
  label: manifest.productName,
  platform: $.isDarwin,
  submenu: [{
    label: 'About ' + manifest.productName,
    role: 'about'
  }, {
    label: 'Check for Update',
    click: $.checkForUpdate()
  }, {
    type: 'separator'
  }, {
    label: 'Services',
    role: 'services',
    submenu: []
  }, {
    type: 'separator'
  }, {
    label: 'Hide ' + manifest.productName,
    accelerator: 'Cmd+H',
    role: 'hide'
  }, {
    label: 'Hide Others',
    accelerator: 'Cmd+Shift+H',
    role: 'hideothers'
  }, {
    label: 'Show All',
    role: 'unhide'
  }, {
    type: 'separator'
  }, {
    label: 'Quit',
    accelerator: 'Cmd+Q',
    click: $.appExit()
  }]
};
