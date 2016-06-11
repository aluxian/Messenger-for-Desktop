import SpellChecker from 'spellchecker';
import {app} from 'electron';
import path from 'path';
import fs from 'fs';

import platform from 'common/utils/platform';
import languageCodes from 'browser/utils/language-codes';
import files from 'common/utils/files';

let hunspellDictionarySearchPaths = null;
let hunspellDictionaries = null;

export function getDictionarySearchPaths () {
  if (!hunspellDictionarySearchPaths) {
    let searchPaths = [
      path.join(app.getAppPath(), 'dicts'),
      path.join(app.getAppPath(), 'node_modules', 'spellchecker', 'vendor', 'hunspell_dictionaries')
    ];

    // Special case being in an asar archive
    searchPaths = searchPaths.map((searchPath) => {
      if (searchPath.includes('.asar' + path.sep)) {
        const unpacked = searchPath.replace('.asar' + path.sep, '.asar.unpacked' + path.sep);
        if (fs.statSyncNoException(unpacked)) {
          return unpacked;
        }
      }
      return searchPath;
    });

    if (platform.isLinux) {
      searchPaths = searchPaths.concat([
        '/usr/share/hunspell',
        '/usr/share/myspell',
        '/usr/share/myspell/dicts',
        '/Library/Spelling'
      ]);
    }

    hunspellDictionarySearchPaths = searchPaths;
  }

  return hunspellDictionarySearchPaths;
}

export function getAvailableDictionaries () {
  let availableDictionaries = SpellChecker.getAvailableDictionaries();
  if (availableDictionaries.length) {
    return availableDictionaries;
  }

  if (!hunspellDictionaries) {
    try {
      hunspellDictionaries = files.getAllDictionariesSync(getDictionarySearchPaths());
      hunspellDictionaries = hunspellDictionaries.filter((dict) => {
        return languageCodes[dict] ||
          languageCodes[dict.replace('-', '_')] ||
          languageCodes[dict.replace('-', '_').split('_')[0]];
      });
      log('filtered dictionaries:', hunspellDictionaries);
    } catch (err) {
      logError(err);
    }
  }

  return hunspellDictionaries;
}

export function getDictionaryPath (langCode) {
  let searchPaths = getDictionarySearchPaths();
  searchPaths = searchPaths.map((searchPath) => {
    return [
      path.join(searchPath, langCode.replace('-', '_') + '.dic'),
      path.join(searchPath, langCode.replace('_', '-') + '.dic')
    ];
  });

  // Flatten and remove duplicates
  searchPaths = [].concat.apply([], searchPaths);
  searchPaths = Array.from(new Set(searchPaths));

  return searchPaths.find(fs.existsSync);
}
