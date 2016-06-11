import {addPath} from 'app-module-path';
import {app} from 'electron';
import path from 'path';

const manifest = require('../../package.json');
global.manifest = manifest;

const appPath = app.getAppPath();
const scriptsPath = path.join(appPath, 'scripts');

addPath(scriptsPath);

require('browser/main');
