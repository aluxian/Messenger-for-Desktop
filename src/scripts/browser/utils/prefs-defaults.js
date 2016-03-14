import SpellChecker from 'spellchecker';
import platform from './platform';

const defaults = {
  'analytics-track': true,
  'analytics-uid': null,
  'auto-check-update': true,
  'launch-startup': false,
  'launch-startup-hidden': true,
  'launch-quit': false,
  'links-in-browser': true,
  'quit-behaviour-taught': false,
  'raffle-code': null,
  'show-notifications-badge': true,
  'show-tray': platform.isWin,
  'show-dock': true,
  'spell-checker-check': false,
  'spell-checker-auto-correct': false,
  'spell-checker-language': defaultSpellCheckerLanguage,
  'theme': 'default',
  'window-bounds': {
    width: 800,
    height: 600
  },
  'window-full-screen': false,
  'zoom-level': 0
};

function get(key) {
  let def = defaults[key];
  if (typeof def === 'function') {
    def = def();
    defaults[key] = def;
  }
  return def;
}

function defaultSpellCheckerLanguage() {
  let spellCheckerLanguage = 'en_US';

  const envLang = process.env.LANG;
  if (envLang) {
    spellCheckerLanguage = envLang.split('.')[0];
  }

  const availableLanguages = SpellChecker.getAvailableDictionaries();
  if (!availableLanguages.length || availableLanguages.includes(spellCheckerLanguage)) {
    return spellCheckerLanguage;
  }

  if (spellCheckerLanguage.includes('_')) {
    spellCheckerLanguage = spellCheckerLanguage.split('_')[0];
    if (availableLanguages.includes(spellCheckerLanguage)) {
      return spellCheckerLanguage;
    }
  }

  return availableLanguages[0];
}

export default {
  get
};
