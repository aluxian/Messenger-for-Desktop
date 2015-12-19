import {webFrame, ipcRenderer as ipcr} from 'electron';
import spellChecker from 'spellchecker';

/**
 * Custom logger. The implicit one doesn't work in preload.
 */
const log = function(...messages) {
  console.log('DEBUG: ' + messages.join(' '));
};

// Set zoom level
ipcr.on('zoom-level', function(event, zoomLevel) {
  log('zoom level', zoomLevel);
  webFrame.setZoomLevel(zoomLevel);
});

// Set spell checker
ipcr.on('spell-checker', function(event, enabled, autoCorrect) {
  autoCorrect = !!autoCorrect;
  log('spell checker enabled:', enabled, 'auto correct:', autoCorrect);
  if (enabled) {
    webFrame.setSpellCheckProvider('en-US', autoCorrect, {
      spellCheck: function(text) {
        return !spellChecker.isMisspelled(text);
      }
    });
  } else {
    webFrame.setSpellCheckProvider('en-US', autoCorrect, {
      spellCheck: function() {
        return true;
      }
    });
  }
});

// Insert the given theme css into the DOM
ipcr.on('apply-theme', function(event, css) {
  let styleBlock = document.getElementById('cssTheme');

  if (!styleBlock) {
    styleBlock = document.createElement('style');
    styleBlock.id = 'cssTheme';
    styleBlock.type = 'text/css';
    document.head.appendChild(styleBlock);
  }

  styleBlock.innerHTML = css;
});

// Add the selected misspelling to the dictionary
ipcr.on('add-selection-to-dictionary', function() {
  spellChecker.add(document.getSelection().toString());
});

// Forward context menu opens
document.addEventListener('contextmenu', function(event) {
  log('seding context-menu');
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
