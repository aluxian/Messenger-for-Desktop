import cp from 'child_process';

import platform from 'common/utils/platform';

function isElementaryOS (callback) {
  if (!platform.isLinux) {
    return callback(null, false);
  }

  let cmd = 'cat /etc/os-release <(lsb_release -d) | grep \\"elementary OS\\"';
  cmd = '/bin/bash -c "' + cmd + '"';
  cp.exec(cmd, (err, stdout, stderr) => callback(null, !!err));
}

export default {
  isElementaryOS
};
