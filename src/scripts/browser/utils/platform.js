export default {
  isDarwin: process.platform == 'darwin',
  isNonDarwin: process.platform != 'darwin',
  isLinux: process.platform == 'linux',
  isWin: process.platform == 'win32'
};
