import {clipboard, Menu, MenuItem} from 'electron';
import spellChecker from 'spellchecker';

import platform from 'common/utils/platform';
import urls from 'common/utils/urls';

function create (params, browserWindow) {
  const webContents = browserWindow.webContents;
  const menu = new Menu();

  if (platform.isDarwin && params.selectionText) {
    menu.append(new MenuItem({
      label: 'Look Up "' + params.selectionText + '"',
      click: () => webContents.send('call-webview-method', 'showDefinitionForSelection')
    }));
  }

  if (params.isEditable && params.misspelledWord) {
    const corrections = spellChecker.getCorrectionsForMisspelling(params.misspelledWord);
    const items = [];

    // add correction suggestions
    for (let i = 0; i < corrections.length && i < 5; i++) {
      items.push(new MenuItem({
        label: 'Correct: ' + corrections[i],
        click: () => webContents.send('call-webview-method', 'replaceMisspelling', corrections[i])
      }));
    }

    // Hunspell doesn't remember these, so skip this item
    // Otherwise, offer to add the word to the dictionary
    if (!platform.isLinux && !params.isWindows7) {
      items.push(new MenuItem({
        label: 'Add to Dictionary',
        click: () => {
          webContents.send('fwd-webview', 'add-selection-to-dictionary');
          webContents.send('call-webview-method', 'replaceMisspelling', params.misspelledWord);
        }
      }));
    }

    // prepend separator and then add items
    if (items.length) {
      menu.append(new MenuItem({
        type: 'separator'
      }));

      for (const item of items) {
        menu.append(item);
      }
    }
  }

  if (params.isEditable) {
    menu.append(new MenuItem({
      type: 'separator'
    }));

    menu.append(new MenuItem({
      label: 'Undo',
      enabled: params.editFlags.canUndo,
      click: () => webContents.send('call-webview-method', 'undo')
    }));

    menu.append(new MenuItem({
      label: 'Redo',
      enabled: params.editFlags.canRedo,
      click: () => webContents.send('call-webview-method', 'redo')
    }));
  }

  if (params.selectionText || params.isEditable) {
    menu.append(new MenuItem({
      type: 'separator'
    }));

    menu.append(new MenuItem({
      label: 'Cut',
      enabled: params.editFlags.canCut,
      click: () => webContents.send('call-webview-method', 'cut')
    }));

    menu.append(new MenuItem({
      label: 'Copy',
      enabled: params.editFlags.canCopy,
      click: () => webContents.send('call-webview-method', 'copy')
    }));

    menu.append(new MenuItem({
      label: 'Paste',
      enabled: params.editFlags.canPaste,
      click: () => webContents.send('call-webview-method', 'pasteAndMatchStyle')
    }));

    menu.append(new MenuItem({
      label: 'Select All',
      enabled: params.editFlags.canSelectAll,
      click: () => webContents.send('call-webview-method', 'selectAll')
    }));
  }

  if (params.linkURL) {
    menu.append(new MenuItem({
      type: 'separator'
    }));

    menu.append(new MenuItem({
      label: 'Copy Link Text',
      enabled: !!params.linkText,
      click: () => clipboard.writeText(params.linkText)
    }));

    menu.append(new MenuItem({
      label: 'Copy Link Address',
      click: () => clipboard.writeText(urls.skipFacebookRedirect(params.linkURL))
    }));
  }

  return menu;
}

export default {
  create
};
