export function P(darwin, linux, win) {
  switch (process.platform) {
    case 'darwin': return darwin;
    case 'linux': return linux || darwin;
    case 'win32': return win || linux || darwin;
  }
}
