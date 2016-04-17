### 2.0.14-beta

- Improve the ordering of menu items (Linux, Windows).
- Improve OS X tray icon display.
- Update Electron to v0.37.6.
- Fix Windows notifications.
- Fix exe path used for the squirrel shortcut.
- Handle tray left- and right-clicks correctly (OS X, Windows).
- Make tray icon alert more prominent (Linux, Windows).
- Add hunspell as a recommended package to the deb release.

### 2.0.13-beta

- Use dictionaries from Hunspell (Linux, Windows).
- Remove rpm dependency on lsb-core-noarch (Linux).
- Let the app move whatsie.desktop at runtime (Linux).
- Include build number and channel name menus.
- Update dependencies eslint and winreg.

### 2.0.12

- Fix rpm build having inconsistent dependencies.
- Fix error about inexistent prefs.
- Fix cp in linux after-install script.
- Fix potential error if a theme would be removed.
- Fix --debug flag for the CLI.
- Add release channels for the auto updater.
- Improve error handling.
- Update dependencies.

### 2.0.11-beta

- Fix auto-launch on startup (Linux).
- Fix rpm package build settings and dependencies (Linux).
- Fix preferences not being saved correctly (sometimes).
- Fix dragging and dropping files onto the app window.
- Change keyboard shortcut for quitting the app from Alt-F4 to Ctrl+Q (Windows, Linux).
- Handle connection errors from the auto updater better.
- Handle WAFD cleaner EBUSY and EPERM errors better.
- Improve the .desktop config used for launching on startup (Linux).
- Improve error logging.
- Improve WAFD cleaner.

### 2.0.10-beta

- Fix the WAFD cleaner removing other files, too.
- Fix the app window not showing when a notification was clicked on OS X.
- Make the WAFD cleaner dialog show the files that are going to be removed.
- Update how items are grouped in the Help menu.

### 2.0.9-beta

- Improve the WhatsApp for Desktop cleaner.
- Fix app closing even with tray icon enabled on Linux.
- Fix category displayed incorrectly on Linux.

### 2.0.8-beta

- Update Electron to v0.37.3.
- Add 4 new themes: Faded, Fluttershy, Orange, Sephia.
- Re-add keyboard shortcuts for navigation conversations.
- Remove 'Paste and Match Style' context menu item.
- Fix language names on Windows.
- Fix WAFD cleaner.

### 2.0.7-beta

- Prompt user to update instead of doing it automatically on quit (Windows).
- Disable the crash reporter if stats reporting is disabled.

### 2.0.6-beta

- Improves support for debugging.
- Improves app launch by adding transitions.
- Adds support for multiple languages for the spell checker.
- Adds option to enable or disable the update checks.
- Adds WAFD cleaner for Windows.
- Updates dependencies.
- Fix for completely black window using Dark theme.
- Fix for crash in Windows auto launcher.

### 2.0.5-beta

- Adds support for raffles.

### 2.0.4-beta

- Fixes OS X auto updater.
- Improved logging.

### 2.0.3-beta

- Upgrades Electron to v0.36.10.
- Upgrades dependencies.

### 2.0.2-beta

- Fixes for the auto updater.
- Include build number in releases.
- Improved logging.

### 2.0.1-beta

- Dummy release to test the updating process.

### 2.0.0-beta

- Initial release.
