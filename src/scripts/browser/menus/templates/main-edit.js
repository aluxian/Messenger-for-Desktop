import platform from '../../utils/platform';
import $ from '../expressions';

export default {
  label: 'Edit',
  allow: platform.isDarwin,
  submenu: [{
    label: 'Undo',
    accelerator: 'Cmd+Z',
    role: 'undo'
  }, {
    label: 'Redo',
    accelerator: 'Shift+Cmd+Z',
    role: 'redo'
  }, {
    type: 'separator'
  }, {
    label: 'Cut',
    accelerator: 'Cmd+X',
    role: 'cut'
  }, {
    label: 'Copy',
    accelerator: 'Cmd+C',
    role: 'copy'
  }, {
    label: 'Paste',
    accelerator: 'Cmd+V',
    role: 'paste'
  }, {
    label: 'Select All',
    accelerator: 'Cmd+A',
    role: 'selectall'
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: 'Check Spelling While Typing',
    click: $.all(
      $.sendToWebView('spell-checker', $.key('checked'), $.pref('spell-checker-auto-correct')),
      $.updateSibling('spell-checker-auto-correct', 'enabled', $.key('checked')),
      $.setPref('spell-checker', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('spell-checker')),
      $.updateSibling('spell-checker-auto-correct', 'enabled', $.key('checked'))
    )
  }, {
    id: 'spell-checker-auto-correct',
    type: 'checkbox',
    label: 'Auto Correct Spelling Mistakes',
    click: $.all(
      $.sendToWebView('spell-checker', $.pref('spell-checker'), $.key('checked')),
      $.setPref('spell-checker-auto-correct', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('spell-checker-auto-correct'))
    )
  }]
};
