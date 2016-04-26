import {addPath} from 'app-module-path';
import remote, {app} from 'remote';
import path from 'path';

global.manifest = remote.getGlobal('manifest');
localStorage.setItem('debug', process.env.DEBUG);

const appPath = app.getAppPath();
const scriptsPath = path.join(appPath, 'scripts');

addPath(scriptsPath);
require('.');
