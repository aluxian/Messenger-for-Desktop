import {remote} from 'electron';
import url from 'url';

const params = url.parse(window.location.href, true).query;
const nativeNotifier = remote.require('common/bridges/native-notifier').default;

function closeWindow () {
  window.close();
}

function onClick () {
  nativeNotifier.onClick(params.identifier);
  closeWindow();
}

function onLoad () {
  const timeout = parseInt(params.timeout, 10);
  if (!isNaN(timeout)) {
    this.setTimeout(closeWindow, timeout);
  }
  document.addEventListener('keydown', onClick, false);
  document.addEventListener('click', onClick);
}

document.getElementById('title').innerHTML = params.title;
document.getElementById('body').innerHTML = params.body;
document.getElementById('icon').style.backgroundImage = 'url(' + params.icon + ')';
document.getElementById('footer').innerHTML = params.footer;

window.addEventListener('load', onLoad, false);
