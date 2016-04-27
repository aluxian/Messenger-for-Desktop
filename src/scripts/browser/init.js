import {addPath} from 'app-module-path';
import path from 'path';
import app from 'app';

const manifest = require('../../package.json');
global.manifest = manifest;

const appPath = app.getAppPath();
const scriptsPath = path.join(appPath, 'scripts');

addPath(scriptsPath);
require('browser/main');
