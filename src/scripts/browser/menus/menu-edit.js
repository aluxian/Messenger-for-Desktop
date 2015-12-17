import $ from './expr';

export default {
  label: 'Edit',
  platform: $.isDarwin,
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
    label: 'Spell Checker',
    click: $.all(
      $.sendToWebContents('spell-checker', $.key('checked')),
      $.updateSibling('auto-correct', 'enabled', $.key('checked')), // TODO ensure bound to parent
      $.setPref('spell-checker', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('spell-checker', $.val(false))),
      $.updateSibling('auto-correct', 'enabled', $.key('checked'))
    )
  }, {
    id: 'auto-correct',
    type: 'checkbox',
    label: 'Auto Correct',
    click: $.all(
      $.sendToWebContents('auto-correct', $.key('checked')),
      $.setPref('auto-correct', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('auto-correct', $.val(false)))
    )
  }]
};
