import {Menu, MenuItem} from 'remote';

/**
 * Custom logger. The implicit one doesn't work in preload.
 */
const log = function(...messages) {
  console.log('DEBUG: ' + messages.join(' '));
};

function separatorItem() {
  return new MenuItem({
    type: 'separator'
  });
}

function undoItem(enabled) {
  return new MenuItem({
    label: 'Undo',
    enabled: enabled
  });
}

function redoItem(enabled) {
  return new MenuItem({
    label: 'Redo',
    enabled: enabled
  });
}

function cutItem(enabled) {
  return new MenuItem({
    label: 'Cut',
    enabled: enabled
  });
}

function copyItem(enabled) {
  return new MenuItem({
    label: 'Copy',
    enabled: enabled
  });
}

function pasteItem(enabled) {
  return new MenuItem({
    label: 'Paste',
    enabled: enabled
  });
}

function pasteMatchItem(enabled) {
  return new MenuItem({
    label: 'Paste and Match Style',
    enabled: enabled
  });
}

function selectAllItem(enabled) {
  return new MenuItem({
    label: 'Select All',
    enabled: enabled
  });
}

function copyLinkAddressItem(enabled) {
  return new MenuItem({
    label: 'Copy Link Address',
    enabled: enabled
  });
}

function copyLinkTextItem(enabled) {
  return new MenuItem({
    label: 'Copy Link Text',
    enabled: enabled
  });
}

function create(event) {
  const menu = new Menu();

  const selection = window.getSelection().toString();
  const hasSelection = !!selection;

  const targetElement = event.target;
  const targetIsInput = targetElement.tagName.toLowerCase() == 'input';
  const targetIsLink = targetElement.tagName.toLowerCase() == 'a';

  menu.append(undoItem(false));
  menu.append(redoItem(false));
  menu.append(separatorItem());
  menu.append(cutItem(hasSelection));
  menu.append(copyItem(hasSelection));
  menu.append(pasteItem(targetIsInput));
  menu.append(pasteMatchItem(targetIsInput));
  menu.append(selectAllItem(targetIsInput));
  menu.append(separatorItem());
  menu.append(copyLinkAddressItem(targetIsLink));
  menu.append(copyLinkTextItem(targetIsLink));

  return menu;
}

export default {
  create
};
