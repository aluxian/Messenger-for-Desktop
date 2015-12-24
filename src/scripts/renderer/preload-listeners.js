import {ipcRenderer as ipcr} from 'electron';
import spellChecker from 'spellchecker';

// Forward context menu opens
document.addEventListener('contextmenu', function(event) {
  log('sending context-menu');
  event.preventDefault();

  const selection = document.getSelection().toString();
  const trimmedText = selection.trim();
  const isMisspelling = !trimmedText.includes(' ') && spellChecker.isMisspelled(trimmedText);
  const corrections = isMisspelling ? spellChecker.getCorrectionsForMisspelling(trimmedText) : [];

  ipcr.send('context-menu', {
    selection: selection,
    hasSelection: !!selection,
    targetIsEditable: event.target.isContentEditable,
    targetIsLink: event.target.tagName == 'A',
    isMisspelling: isMisspelling,
    corrections: corrections,
    href: event.target.href
  });
}, false);
