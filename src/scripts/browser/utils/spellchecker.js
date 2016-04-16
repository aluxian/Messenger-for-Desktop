import SpellChecker from 'spellchecker';
import path from 'path';
import fs from 'fs';

import platform from './platform';
import languageCodes from './language-codes';
import files from './files';

let hunspellDictionaries = null;

export function getDictionaryPath() {
  let dict = path.join(__dirname, '..', 'node_modules', 'spellchecker', 'vendor', 'hunspell_dictionaries');
  try {
    if (platform.isLinux) {
      let usrDict = path.join('/usr', 'share', 'hunspell');
      if (fs.statSyncNoException(usrDict)) {
        dict = usrDict;
      }
    }

    // HACK: Special case being in an asar archive
    const unpacked = dict.replace('.asar' + path.sep, '.asar.unpacked' + path.sep);
    if (fs.statSyncNoException(unpacked)) {
      dict = unpacked;
    }
  } catch (ex) {
    // ignore
  }
  return dict;
}

export function getAvailableDictionaries() {
  let availableDictionaries = SpellChecker.getAvailableDictionaries();
  if (availableDictionaries.length) {
    return availableDictionaries;
  }

  if (!hunspellDictionaries) {
    try {
      hunspellDictionaries = files.getDictionariesSync(getDictionaryPath());
    } catch (err) {
      logError(err);
    }
  }

  hunspellDictionaries = hunspellDictionaries || [];
  hunspellDictionaries = hunspellDictionaries.filter(dict => {
    return languageCodes[dict] || languageCodes[dict.replace('-', '_').split('_')[0]];
  });

  log('filtered dictionaries:', hunspellDictionaries);
  return hunspellDictionaries;
}
