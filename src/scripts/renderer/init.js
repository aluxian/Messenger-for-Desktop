import remote, {app} from 'remote';
import {webFrame} from 'electron';
import path from 'path';

global.manifest = remote.getGlobal('manifest');
localStorage.setItem('debug', process.env.DEBUG);
webFrame.registerURLSchemeAsPrivileged(global.manifest.name);

const appPath = app.getAppPath();
const scriptsPath = path.join(appPath, 'scripts');
const {addPath} = require(path.join(appPath, 'node_modules', 'app-module-path'));

addPath(scriptsPath);
require('renderer/main');
require('renderer/webview');
require('renderer/utils/keymap');
