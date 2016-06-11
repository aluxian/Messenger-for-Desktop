const appPath = require('electron').remote.app.getAppPath();
const initPath = require('path').join(appPath, 'scripts', 'renderer', 'init.js');
require(initPath).inject('shim-notification');

require('renderer/shim-notification/shim');
