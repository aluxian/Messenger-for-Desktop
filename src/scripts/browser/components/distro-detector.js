import cp from 'child_process';

import platform from 'common/utils/platform';

async function elementaryOS () {
  if (!platform.isLinux) {
    return false;
  }

  let cmd = 'cat /etc/os-release <(lsb_release -d) | grep \\"elementary OS\\"';
  cmd = '/bin/bash -c "' + cmd + '"';

  return await new Promise((resolve, reject) => {
    cp.exec(cmd, (err, stdout, stderr) => resolve(!!err));
  });
}

export default {
  elementaryOS
};
