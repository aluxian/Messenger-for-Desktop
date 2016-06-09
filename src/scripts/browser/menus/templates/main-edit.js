import {getAvailableDictionaries} from 'browser/utils/spellchecker';
import languageCodes from 'browser/utils/language-codes';
import platform from 'common/utils/platform';
import prefs from 'browser/utils/prefs';
import $ from 'browser/menus/expressions';

const spellCheckerLanguage = prefs.get('spell-checker-language');
const availableLanguages = getAvailableDictionaries()
  .map((langCode) => {
    return {
      code: langCode,
      name: languageCodes[langCode] || languageCodes[langCode.replace('-', '_').split('_')[0]]
    };
  })
  .sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  });

export default {
  label: 'Edit',
  submenu: [{
    label: 'Undo',
    allow: platform.isDarwin,
    accelerator: 'Cmd+Z',
    role: 'undo'
  }, {
    label: 'Redo',
    allow: platform.isDarwin,
    accelerator: 'Shift+Cmd+Z',
    role: 'redo'
  }, {
    type: 'separator',
    allow: platform.isDarwin
  }, {
    label: 'Cut',
    allow: platform.isDarwin,
    accelerator: 'Cmd+X',
    role: 'cut'
  }, {
    label: 'Copy',
    allow: platform.isDarwin,
    accelerator: 'Cmd+C',
    role: 'copy'
  }, {
    label: 'Paste',
    allow: platform.isDarwin,
    accelerator: 'Cmd+V',
    role: 'paste'
  }, {
    label: 'Select All',
    allow: platform.isDarwin,
    accelerator: 'Cmd+A',
    role: 'selectall'
  }, {
    type: 'separator',
    allow: platform.isDarwin
  }, {
    type: 'checkbox',
    label: 'Check &Spelling While Typing',
    accelerator: 'CmdOrCtrl+Alt+S',
    click: $.all(
      $.sendToWebView('spell-checker', $.key('checked'), $.pref('spell-checker-auto-correct'), $.pref('spell-checker-language')),
      $.updateSibling('spell-checker-auto-correct', 'enabled', $.key('checked')),
      $.updateSibling('spell-checker-language', 'enabled', $.key('checked')),
      $.setPref('spell-checker-check', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('spell-checker-check'))
    )
  }, {
    id: 'spell-checker-auto-correct',
    type: 'checkbox',
    label: '&Auto Correct Spelling Mistakes',
    allow: false,
    click: $.all(
      $.sendToWebView('spell-checker', $.pref('spell-checker-check'), $.key('checked'), $.pref('spell-checker-language')),
      $.setPref('spell-checker-auto-correct', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('enabled', $.pref('spell-checker-check')),
      $.setLocal('checked', $.pref('spell-checker-auto-correct'))
    )
  }, {
    id: 'spell-checker-language',
    label: 'Spell Checker Language',
    submenu: availableLanguages.map(lang => ({
      type: 'radio',
      label: lang.name,
      langCode: lang.code,
      checked: spellCheckerLanguage === lang.code,
      click: $.all(
        $.ifTrue(
          $.pref('spell-checker-check'),
          $.sendToWebView('spell-checker', $.pref('spell-checker-check'), $.pref('spell-checker-auto-correct'), $.key('langCode'))
        ),
        $.setPref('spell-checker-language', $.key('langCode'))
      )
    }))
  }]
};
