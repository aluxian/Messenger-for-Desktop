import manifest from '../../../../package.json';
import filePaths from '../../utils/file-paths';
import appleScript from 'applescript';
import async from 'async';

import BaseAutoLauncher from './base';

class DarwinAutoLauncher extends BaseAutoLauncher {

  enable(hidden = false, callback) {
    const props = {
      path: filePaths.getAppDir(),
      name: manifest.productName,
      hidden: hidden
    };

    const cmd = [
      'tell application "System Events" to',
      'make login item at end with properties',
      JSON.stringify(props)
    ].join(' ');

    log('making system login item with properties', props);
    async.series([
      this.disable,
      async.apply(appleScript.execString, cmd)
    ], callback);
  }

  disable(callback) {
    const name = '"' + manifest.productName + '"';
    const cmd = [
      'tell application "System Events" to',
      'delete login item',
      name
    ].join(' ');

    log('removing system login item', name);
    appleScript.execString(cmd, callback);
  }

  isEnabled(callback) {
    const cmd = [
      'tell application "System Events" to',
      'get the name of every login item'
    ].join(' ');

    log('querying system login items');
    appleScript.execString(cmd, function(err, items) {
      const enabled = Array.isArray(items) && items.includes(manifest.productName);
      callback(err, enabled);
    });
  }

}

export default DarwinAutoLauncher;
