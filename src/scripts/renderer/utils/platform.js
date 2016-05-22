function isWindows7() {
  return !!navigator.userAgent.match(/(Windows 7|Windows NT 6\.1)/);
}

export default {
  isWindows7
};
