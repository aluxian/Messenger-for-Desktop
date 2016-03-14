import SpellChecker from 'spellchecker';

import languageCodes from '../../utils/language-codes';
import platform from '../../utils/platform';
import prefs from '../../utils/prefs';
import $ from '../expressions';

const spellCheckerLanguage = prefs.get('spell-checker-language');
const availableLanguages = SpellChecker.getAvailableDictionaries()
  .map((langCode) => {
    return {
      code: langCode,
      name: languageCodes[langCode] || langCode
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
    label: 'Auto Correct Spelling Mistakes',
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
    submenu: availableLanguages.map(lang => {
      return {
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
      };
    })
  }]
};
