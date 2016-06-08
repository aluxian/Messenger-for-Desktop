import $ from 'browser/menus/expressions';

export default {
  label: 'Theme',
  submenu: Object.keys(global.manifest.themes).map((themeId, index) => ({
    type: 'radio',
    label: global.manifest.themes[themeId],
    theme: themeId,
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
