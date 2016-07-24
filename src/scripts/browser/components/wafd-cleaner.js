import {app} from 'electron';
import path from 'path';
import del from 'del';

const paths = [
  path.join(app.getPath('desktop'), 'WhatsApp for Desktop.lnk'),
  path.join(app.getPath('desktop'), 'WhatsApp.lnk'),
  path.join(app.getPath('desktop'), 'Unofficial WhatsApp for Desktop.lnk'),
  path.join(app.getPath('desktop'), 'Unofficial WhatsApp.lnk'),
  path.join(app.getPath('appData'), 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WhatsApp for Desktop'),
  path.join(app.getPath('appData'), 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WhatsApp'),
  path.join(app.getPath('appData'), 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Unofficial WhatsApp for Desktop'),
  path.join(app.getPath('appData'), 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Unofficial WhatsApp'),
  path.join(app.getPath('appData'), 'WhatsApp'),
  path.join(app.getPath('appData'), 'UnofficialWhatsApp'),
  path.join(app.getPath('appData'), '..', 'Local', 'WhatsApp'),
  path.join(app.getPath('appData'), '..', 'Local', 'UnofficialWhatsApp'),
  path.join('C:', 'ProgramData', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WhatsApp for Desktop.lnk'),
  path.join('C:', 'ProgramData', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'WhatsApp.lnk'),
  path.join('C:', 'ProgramData', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Unofficial WhatsApp for Desktop.lnk'),
  path.join('C:', 'ProgramData', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Unofficial WhatsApp.lnk'),
  path.join('C:', 'Program Files', 'WhatsApp for Desktop'),
  path.join('C:', 'Program Files', 'Unofficial WhatsApp for Desktop'),
  path.join('C:', 'Program Files (x86)', 'WhatsApp for Desktop'),
  path.join('C:', 'Program Files (x86)', 'Unofficial WhatsApp for Desktop')
];

function check (callback) {
  clean(callback, true);
}

function clean (callback, dryRun = false) {
  del((paths), {force: true, dryRun})
    .catch((err) => callback(err))
    .then((paths) => callback(null, paths));
}

export default {
  check,
  clean
};
