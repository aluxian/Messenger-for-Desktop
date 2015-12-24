import manifest from '../../../../package.json';
import platform from '../../utils/platform';
import $ from '../expressions';

export default {
  label: manifest.productName,
  platform: platform.isDarwin,
  submenu: [{
    label: 'About ' + manifest.productName,
    role: 'about'
  }, {
    label: 'Check for Update',
    click: $.checkForUpdate()
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: 'Launch on Startup',
    click: $.all(
      $.launchOnStartup($.key('checked'), $.pref('startup-hidden')),
      $.updateSibling('startup-hidden', 'enabled', $.key('checked')),
      $.setPref('launch-startup', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('launch-startup', $.val(false))),
      $.updateSibling('startup-hidden', 'enabled', $.key('checked'))
    )
  }, {
    id: 'startup-hidden',
    type: 'checkbox',
    label: 'Start Hidden on Startup',
    click: $.all(
      $.ifTrue($.val(platform.isDarwin), $.launchOnStartupHidden($.key('checked'))),
      $.setPref('startup-hidden', $.key('checked')),
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('startup-hidden', $.val(false)))
    )
  }, {
    type: 'checkbox',
    label: 'Anonymous Statistics',
    click: $.all(
      $.setPref('analytics', $.key('checked')),
      $.reloadWindow()
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('analytics', $.val(true)))
    )
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
    click: $.appQuit()
  }]
};
