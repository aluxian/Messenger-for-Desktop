import platform from './platform';

export default {
  'analytics-track': true,
  'analytics-uid': null,
  'launch-startup': false,
  'launch-startup-hidden': true,
  'launch-quit': false,
  'links-in-browser': true,
  'quit-behaviour-taught': false,
  'show-notifications-badge': true,
  'show-tray': platform.isWin,
  'show-dock': true,
  'spell-checker': false,
  'spell-checker-auto-correct': false,
  'theme': 'default',
  'window-bounds': {
    width: 800,
    height: 600
  },
  'window-full-screen': false,
  'zoom-level': 0
};
