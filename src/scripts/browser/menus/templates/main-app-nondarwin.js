import SpellChecker from 'spellchecker';

import languageCodes from '../../utils/language-codes';
import manifest from '../../../../package.json';
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
  label: '&App',
  allow: platform.isNonDarwin,
  submenu: [{
    label: 'Version ' + manifest.version,
    enabled: false
  }, {
    id: 'cfu-check-for-update',
    label: 'Check for &Update',
    click: $.cfuCheckForUpdate()
  }, {
    id: 'cfu-checking-for-update',
    label: 'Checking for &Update...',
    enabled: false,
    visible: false
  }, {
    id: 'cfu-update-available',
    label: 'Download &Update',
    allow: platform.isLinux || global.options.portable,
    visible: false,
    click: $.cfuUpdateAvailable()
  }, {
    id: 'cfu-update-available',
    label: 'Downloading &Update...',
    allow: !platform.isLinux && !global.options.portable,
    enabled: false,
    visible: false
  }, {
    id: 'cfu-update-downloaded',
    label: 'Restart and Install &Update',
    visible: false,
    click: $.cfuUpdateDownloaded()
  }, {
    type: 'checkbox',
    label: 'Check for Update Automatically',
    click: $.all(
      $.checkForUpdateAuto($.key('checked')),
      $.setPref('auto-check-update', $.key('checked'))
    ),
    parse: $.setLocal('checked', $.pref('auto-check-update'))
  }, {
    type: 'checkbox',
    label: '&Report Stats and Errors',
    click: $.setPref('analytics-track', $.key('checked')),
    parse: $.setLocal('checked', $.pref('analytics-track'))
  }, {
    type: 'separator',
    allow: !global.options.portable
  }, {
    type: 'checkbox',
    label: '&Launch on Startup',
    allow: !global.options.portable,
    click: $.all(
      $.launchOnStartup($.key('checked')),
      $.updateSibling('startup-hidden', 'enabled', $.key('checked')),
      $.setPref('launch-startup', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('launch-startup')),
      $.updateSibling('startup-hidden', 'enabled', $.key('checked'))
    )
  }, {
    id: 'startup-hidden',
    type: 'checkbox',
    label: 'Start &Hidden on Startup',
    allow: !global.options.portable,
    click: $.setPref('launch-startup-hidden', $.key('checked')),
    parse: $.setLocal('checked', $.pref('launch-startup-hidden'))
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: 'Check &Spelling While Typing',
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
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: '&Float on Top',
    accelerator: 'Ctrl+Shift+F',
    click: $.floatOnTop($.key('checked'))
  }, {
    type: 'checkbox',
    label: 'Show in &Tray',
    click: $.all(
      $.showInTray($.key('checked')),
      $.setPref('show-tray', $.key('checked'))
    ),
    parse: $.all(
      $.setLocal('checked', $.pref('show-tray')),
    )
  }, {
    type: 'checkbox',
    label: 'Open Links in &Browser',
    click: $.setPref('links-in-browser', $.key('checked')),
    parse: $.setLocal('checked', $.pref('links-in-browser'))
  }, {
    type: 'separator'
  }, {
    label: '&Quit',
    accelerator: 'Alt+F4',
    click: $.appQuit()
  }]
};
