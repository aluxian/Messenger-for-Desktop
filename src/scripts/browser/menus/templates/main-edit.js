import {getAvailableDictionaries} from 'common/utils/spellchecker';
import languageCodes from 'common/utils/language-codes';
import platform from 'common/utils/platform';
import prefs from 'browser/utils/prefs';
import $ from 'browser/menus/expressions';

const spellCheckerLanguage = prefs.get('spell-checker-language');
const availableLanguages = getAvailableDictionaries()
  .map((langCode) => {
    return {
      code: langCode,
      name: languageCodes[langCode] ||
        languageCodes[langCode.replace('-', '_')] ||
        languageCodes[langCode.replace('-', '_').split('_')[0]]
    };
  })
  .filter((langObj) => langObj.name)
  .filter((langObj, index, arr) => {
    for (let i = index + 1; i < arr.length; i++) {
      if (arr[i].name === langObj.name) {
        return false;
      }
    }

    return true;
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
    allow: platform.isDarwin,
    role: 'undo'
  }, {
    allow: platform.isDarwin,
    role: 'redo'
  }, {
    type: 'separator',
    allow: platform.isDarwin
  }, {
    allow: platform.isDarwin,
    role: 'cut'
  }, {
    allow: platform.isDarwin,
    role: 'copy'
  }, {
    allow: platform.isDarwin,
    role: 'paste'
  }, {
    allow: platform.isDarwin,
    role: 'delete'
  }, {
    allow: platform.isDarwin,
    role: 'selectall'
  }, {
    type: 'separator',
    allow: platform.isDarwin
  }, {
    type: 'checkbox',
    label: 'Check &Spelling While Typing',
    accelerator: 'CmdOrCtrl+Alt+S',
    needsWindow: true,
    click: $.all(
      $.sendToWebView(
        'spell-checker',
        $.key('checked'),
        $.pref('spell-checker-auto-correct'),
        $.pref('spell-checker-language')
      ),
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
    needsWindow: true,
    allow: false,
    click: $.all(
      $.sendToWebView(
        'spell-checker',
        $.pref('spell-checker-check'),
        $.key('checked'),
        $.pref('spell-checker-language')
      ),
      $.setPref('spell-checker-auto-correct', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('enabled', $.pref('spell-checker-check')),
      $.setLocal('checked', $.pref('spell-checker-auto-correct'))
    )
  }, {
    id: 'spell-checker-language',
    label: 'Spell Checker Language',
    submenu: availableLanguages.map((lang) => ({
      type: 'radio',
      label: lang.name,
      langCode: lang.code,
      checked: spellCheckerLanguage === lang.code,
      needsWindow: true,
      click: $.all(
        $.ifTrue(
          $.pref('spell-checker-check'),
          $.sendToWebView(
            'spell-checker',
            $.pref('spell-checker-check'),
            $.pref('spell-checker-auto-correct'),
            $.key('langCode')
          )
        ),
        $.setPref('spell-checker-language', $.key('langCode'))
      )
    }))
  }]
};
