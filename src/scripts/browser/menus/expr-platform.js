export const isDarwin = process.platform == 'darwin';
export const isNonDarwin = process.platform != 'darwin';
export const isLinux = process.platform == 'linux';
export const isWin = process.platform == 'win32';

export function accelerator(darwinAcc, linuxAcc, winAcc) {
  switch (process.platform) {
    case 'darwin': return darwinAcc;
    case 'linux': return linuxAcc || darwinAcc;
    case 'win32': return winAcc || linuxAcc || darwinAcc;
  }
};
