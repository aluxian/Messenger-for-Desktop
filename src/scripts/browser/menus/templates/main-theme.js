import $ from '../expressions';

const themes = [
  'Default',
  'Pure',
  'Grey',
  'Dark'
];

export default {
  label: 'Theme',
  submenu: themes.map(theme => {
    return {
      type: 'radio',
      label: theme,
      theme: theme.toLowerCase(),
      click: $.all(
        $.themeCss($.key('theme'), css => $.sendToWebView('apply-theme', $.val(css))),
        $.setPref('theme', $.key('theme'))
      ),
      parse: $.all(
        $.setLocal('checked', $.eq($.pref('theme'), $.key('theme')))
      )
    };
  })
};
