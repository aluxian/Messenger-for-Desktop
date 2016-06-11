import {remote} from 'electron';
import path from 'path';

export function inject () {
  global.manifest = remote.getGlobal('manifest');
  window.localStorage.setItem('debug', process.env.DEBUG);

  const appPath = remote.app.getAppPath();
  const {addPath} = require(path.join(appPath, 'node_modules', 'app-module-path'));

  addPath(path.join(appPath, 'scripts'));
  addPath(path.join(appPath, 'node_modules'));

  // Add loggers to be used in the console
  const logger = require('common/utils/logger');
  window.log = logger.debugLogger('console:renderer');
  window.logError = logger.errorLogger('console:renderer', false);
  window.logFatal = logger.errorLogger('console:renderer', true);

  // Handle errors
  window.onerror = function (message, source, lineno, colno, error) {
    window.logError(error instanceof Error ? error : new Error(error || message));
  };
}
