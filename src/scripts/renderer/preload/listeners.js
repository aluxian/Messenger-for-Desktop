import {ipcRenderer} from 'electron';
import spellChecker from 'spellchecker';

import platform from 'renderer/utils/platform';

// Forward context menu opens
document.addEventListener('contextmenu', function(event) {
  log('sending context-menu');
  event.preventDefault();

  const selection = document.getSelection().toString();
  const trimmedText = selection.trim();
  const isMisspelling = !trimmedText.includes(' ') && spellChecker.isMisspelled(trimmedText);
  const corrections = isMisspelling ? spellChecker.getCorrectionsForMisspelling(trimmedText) : [];

  const payload = {
    selection: selection,
    hasSelection: !!selection,
    targetIsEditable: event.target.isContentEditable,
    targetIsLink: event.target.tagName == 'A',
    isMisspelling: isMisspelling,
    corrections: corrections,
    href: event.target.href,
    isWindows7: platform.isWindows7()
  };

  log('sending context menu', payload);
  ipcRenderer.send('context-menu', payload);
}, false);
