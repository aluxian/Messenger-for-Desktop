import $ from 'browser/menus/expressions';

export default {
  label: 'Theme',
  submenu: global.manifest.themes.map((theme, index) => ({
    type: 'radio',
    label: theme,
    theme: theme.toLowerCase(),
    accelerator: index < 10 ? 'CmdOrCtrl+Alt+' + index : undefined,
    click: $.all(
      $.themeCss($.key('theme'), css => $.sendToWebView('apply-theme', $.val(css))),
      $.setPref('theme', $.key('theme'))
    ),
    parse: $.all(
      $.setLocal('checked', $.eq($.pref('theme'), $.key('theme')))
    )
  }))
};
