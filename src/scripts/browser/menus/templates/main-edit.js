import {getAvailableDictionaries} from 'common/utils/spellchecker';
import languageCodes from 'common/utils/language-codes';
import prefs from 'browser/utils/prefs';

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
  role: 'edit',
  submenu: [{
    role: 'undo'
  }, {
    role: 'redo'
  }, {
    type: 'separator'
  }, {
    role: 'cut'
  }, {
    role: 'copy'
  }, {
    role: 'paste'
  }, {
    role: 'delete'
  }, {
    role: 'selectall'
  }, {
    type: 'separator'
  }, {
    type: 'checkbox',
    label: 'Check Spelling While Typing',
    accelerator: 'CmdOrCtrl+Alt+S',
    checked: prefs.get('spell-checker-check'),
    click (menuItem, browserWindow) {
      browserWindow.webContents.send('fwd-webview', 'spell-checker',
        menuItem.checked,
        prefs.get('spell-checker-auto-correct'),
        prefs.get('spell-checker-language'));
      menuItem.menu.items.find(e => e.label === 'Auto Correct Spelling Mistakes').enabled = menuItem.checked;
      menuItem.menu.items.find(e => e.label === 'Spell Checker Language').enabled = menuItem.checked;
      prefs.set('spell-checker-check', menuItem.checked);
    }
  }, {
    type: 'checkbox',
    label: 'Auto Correct Spelling Mistakes',
    visible: false,
    checked: prefs.get('spell-checker-auto-correct'),
    enabled: prefs.get('spell-checker-check'),
    click (menuItem, browserWindow) {
      browserWindow.webContents.send('fwd-webview', 'spell-checker',
        prefs.get('spell-checker-check'),
        menuItem.checked,
        prefs.get('spell-checker-language'));
      prefs.set('spell-checker-auto-correct', menuItem.checked);
    }
  }, {
    label: 'Spell Checker Language',
    submenu: availableLanguages.map((lang) => ({
      type: 'radio',
      label: lang.name,
      checked: spellCheckerLanguage === lang.code,
      click (menuItem, browserWindow) {
        if (prefs.get('spell-checker-check')) {
          browserWindow.webContents.send('fwd-webview', 'spell-checker',
          prefs.get('spell-checker-check'),
          prefs.get('spell-checker-auto-correct'),
          lang.code);
        }
        prefs.set('spell-checker-language', lang.code);
      }
    }))
  }]
};
