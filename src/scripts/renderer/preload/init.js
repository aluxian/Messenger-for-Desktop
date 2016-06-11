import {remote} from 'electron';
import path from 'path';

global.manifest = remote.getGlobal('manifest');
window.localStorage.setItem('debug', process.env.DEBUG);

const appPath = remote.app.getAppPath();
const {addPath} = require(path.join(appPath, 'node_modules', 'app-module-path'));

addPath(path.join(appPath, 'scripts'));
addPath(path.join(appPath, 'node_modules'));

// Add loggers to be used in the console
const logger = require('common/utils/logger');
window.log = logger.debugLogger('console:webview');
window.logError = logger.errorLogger('console:webview', false);
window.logFatal = logger.errorLogger('console:webview', true);

require('renderer/preload');
