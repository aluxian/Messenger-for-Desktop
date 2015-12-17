export function accelerator(darwinAcc, linuxAcc, winAcc) {
  switch (process.platform) {
    case 'darwin': return darwinAcc;
    case 'linux': return linuxAcc || darwinAcc;
    case 'win32': return winAcc || linuxAcc || darwinAcc;
  }
};
