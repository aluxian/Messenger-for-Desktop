import Mousetrap from 'mousetrap';
import webView from './webview';

log('binding keyboard keymap');

// Previous chat
Mousetrap.bind(['command+up', 'ctrl+up'], function() {
  console.log('UP!');
  return false;
});

// Next chat
Mousetrap.bind(['command+down', 'ctrl+down'], function() {
  console.log('DOWN!');
  return false;
});
