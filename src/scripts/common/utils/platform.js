export default {
  isDarwin: process.platform === 'darwin',
  isNonDarwin: process.platform !== 'darwin',
  isWindows: process.platform === 'win32',
  isLinux: process.platform === 'linux',
  isWindows7: process.platform === 'win32' && process.type === 'renderer' &&
    !!window.navigator.userAgent.match(/(Windows 7|Windows NT 6\.1)/)
};
