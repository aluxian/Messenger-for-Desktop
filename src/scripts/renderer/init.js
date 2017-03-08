import {remote} from 'electron';
import path from 'path';

export function inject (scope) {
  global.manifest = remote.getGlobal('manifest');
  global.options = remote.getGlobal('options');

  const appPath = remote.app.getAppPath();
  const {addPath} = require(path.join(appPath, 'node_modules', 'app-module-path'));

  addPath(path.join(appPath, 'scripts'));
  addPath(path.join(appPath, 'node_modules'));

  // Add loggers to be used in the console
  const logger = require('common/utils/logger');
  window.log = logger.debugLogger('console:' + scope);
  window.logError = logger.errorLogger('console:' + scope, false);
  window.logFatal = logger.errorLogger('console:' + scope, true);

  // Handle errors
  window.onerror = function (message, source, lineno, colno, error) {
    window.logError(error instanceof Error ? error : new Error(error || message));
  };
}
