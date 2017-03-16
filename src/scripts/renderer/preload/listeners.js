import {remote} from 'electron';

import platform from 'common/utils/platform';

// Forward context menu opens
remote.getCurrentWebContents().on('context-menu', function (event, params) {
  params.isWindows7 = platform.isWindows7;
  params = JSON.stringify(params);
  log('sending context menu', event, params);
  remote.getGlobal('application').mainWindowManager.openContextMenu(params);
  event.preventDefault();
});
