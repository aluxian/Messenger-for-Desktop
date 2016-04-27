export default {
  isDarwin: process.platform == 'darwin',
  isNonDarwin: process.platform != 'darwin',
  isWindows: process.platform == 'win32',
  isLinux: process.platform == 'linux'
};
