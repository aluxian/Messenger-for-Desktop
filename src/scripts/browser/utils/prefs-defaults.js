import app from 'app';

import {getAvailableDictionaries} from 'browser/utils/spellchecker';
import platform from 'common/utils/platform';

let availableLanguages = null;
const defaults = {
  'analytics-track': true,
  'analytics-uid': null,
  'launch-startup': false,
  'launch-startup-hidden': true,
  'launch-quit': false,
  'links-in-browser': true,
  'close-with-esc': false,
  'quit-behaviour-taught': false,
  'raffle-code': null,
  'show-notifications-badge': true,
  'show-tray': platform.isWindows,
  'show-dock': true,
  'spell-checker-check': false,
  'spell-checker-auto-correct': false,
  'spell-checker-language': defaultSpellCheckerLanguage,
  'theme': 'default',
  'updates-auto-check': true,
  'updates-channel': global.manifest.versionChannel,
  'window-bounds': {
    width: 920,
    height: 610
  },
  'window-full-screen': false,
  'zoom-level': 0
};

function get(key) {
  if (key === 'spell-checker-language') {
    const valueFn = defaults[key];
    if (typeof valueFn === 'function') {
      if (global.ready) {
        defaults[key] = valueFn();
        return defaults[key];
      } else {
        return valueFn();
      }
    }
  }

  return defaults[key];
}

function defaultSpellCheckerLanguage() {
  let defaultLanguage = null;

  if (!availableLanguages) {
    availableLanguages = getAvailableDictionaries();
  }

  // Try to get it from app
  if (global.ready) {
    defaultLanguage = app.getLocale();
    if (typeof defaultLanguage === 'string') {
      defaultLanguage = defaultLanguage.replace('-', '_');
      defaultLanguage = validateLanguage(defaultLanguage);
      if (defaultLanguage) {
        return defaultLanguage;
      }
    }
    defaultLanguage = null;
  }

  // Try to get it from env
  if (typeof process.env.LANG === 'string') {
    defaultLanguage = process.env.LANG.split('.')[0];
    defaultLanguage = defaultLanguage.replace('-', '_');
    defaultLanguage = validateLanguage(defaultLanguage);
    if (defaultLanguage) {
      return defaultLanguage;
    }
    defaultLanguage = null;
  }

  // Try to use the first available language
  if (availableLanguages.length) {
    return availableLanguages[0];
  }

  // Use the default
  return 'en_US';
}

function validateLanguage(lang) {
  if (availableLanguages.includes(lang)) {
    return lang;
  } else {
    lang = lang.split('_')[0];
    if (availableLanguages.includes(lang)) {
      return lang;
    }
  }
  return null;
}

export default {
  get
};
