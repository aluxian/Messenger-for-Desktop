import cp from 'child-process-promise';

import platform from 'common/utils/platform';

async function elementaryOS () {
  if (!platform.isLinux) {
    log('not on linux, elementaryOS=false');
    return false;
  }

  log('checking /etc/os-release');
  return await cp.exec('cat /etc/os-release')
    .then((result) => {
      const status = result.stdout.toLowerCase().includes('elementary os');
      log('read /etc/os-release, elementaryOS=' + status);
      return status;
    })
    .catch((err) => {
      logError(err, true);
      log('error, elementaryOS=false');
      return false;
    });
}

export default {
  elementaryOS
};
