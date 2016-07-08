## [2.0.16-dev](https://github.com/Aluxian/Whatsie/tree/v2.0.16) (2016-08-07)

[Full Changelog](https://github.com/Aluxian/Whatsie/compare/v2.0.15...v2.0.16) &bull; [Download](https://github.com/Aluxian/Whatsie/releases/tag/v2.0.16)

**General**

- Add a menu item to enter debug mode more easily.
- Add new themes: Shadow, Numix Dark.
- Remove themes: Fluttershy, Orange.
- Improve the build flow and add code linting.
- Improve the context menu.
- Increase min-width of window in mini mode.
- Highlight unread notifications in mini mode.
- Search for spellchecker dictionaries in multiple paths.
- Ship custom dictionaries with the app: en, de, es, fr, ru, ro.
- Update dependencies and Electron to v1.2.6.
- Remove raffle functionality.

**OS X**

- Add showDefinitionForSelection in the context menu.
- Ship LICENSE and LICENSES.chromium.html with the app.

**Windows**

- Implement custom notifications for Windows 7.
- Auto-update on quit.

**Linux**

- Add X-GNOME-UsesNotifications=true to the deb package.
- Add dock badge support for Unity.
- Disable "show in tray" menu item on Elementary OS.
- Closing the window will just minimize the app on Elementary OS.
- Fix window icon.

## [2.0.15-beta](https://github.com/Aluxian/Whatsie/tree/v2.0.15) (2016-28-04)

[Full Changelog](https://github.com/Aluxian/Whatsie/compare/v2.0.14...v2.0.15) &bull; [Download](https://github.com/Aluxian/Whatsie/releases/tag/v2.0.15)

**General**

- Add a new preference: close with Esc key.
- Add more keyboard shortcuts to the menu.
- Add an item to the tray menu to reset the window's position and size.
- Add a link to FAQ in the help menu.
- Show notifications count in the window's title.
- Disable features that are not yet fully functional.
- Improve logging, analytics and error reporting.
- Remove the native crash reporter.
- Update dependencies, remove redundant ones.
- Update Electron to 0.37.8.

**Windows**

- Show a badge on the taskbar icon with the number of missed notifications.
- Handle Squirrel (installer) error messages better.
- Fix window getting stuck far off-screen.
- Use ico instead of png icons for the tray icon.

**Linux**

- Improve deb dependencies.
- Fix clicking the tray icon not showing the app.
- Fix the auto launcher by simplifying the process.
- Deb releases are now distributed in 3 channels (stable, beta, dev).
- Merge notifications with the same title.

## [2.0.14-beta](https://github.com/Aluxian/Whatsie/tree/v2.0.14) (2016-17-04)

[Full Changelog](https://github.com/Aluxian/Whatsie/compare/v2.0.13...v2.0.14) &bull; [Download](https://github.com/Aluxian/Whatsie/releases/tag/v2.0.14)
- Improve the ordering of menu items (Linux, Windows).
- Improve OS X tray icon display.
- Update Electron to v0.37.6.
- Fix Windows notifications.
- Fix exe path used for the squirrel shortcut.
- Handle tray left- and right-clicks correctly (OS X, Windows).
- Make tray icon alert more prominent (Linux, Windows).
- Add hunspell as a recommended package to the deb release.

## [2.0.13-beta](https://github.com/Aluxian/Whatsie/tree/v2.0.13) (2016-16-04)

[Full Changelog](https://github.com/Aluxian/Whatsie/compare/v2.0.12...v2.0.13) &bull; [Download](https://github.com/Aluxian/Whatsie/releases/tag/v2.0.13)
- Use dictionaries from Hunspell (Linux, Windows).
- Remove rpm dependency on lsb-core-noarch (Linux).
- Let the app move whatsie.desktop at runtime (Linux).
- Include build number and channel name menus.
- Update dependencies eslint and winreg.

## [2.0.12](https://github.com/Aluxian/Whatsie/tree/v2.0.12) (2016-16-04)

[Full Changelog](https://github.com/Aluxian/Whatsie/compare/v2.0.11...v2.0.12) &bull; [Download](https://github.com/Aluxian/Whatsie/releases/tag/v2.0.12)
- Fix rpm build having inconsistent dependencies.
- Fix error about inexistent prefs.
- Fix cp in linux after-install script.
- Fix potential error if a theme would be removed.
- Fix --debug flag for the CLI.
- Add release channels for the auto updater.
- Improve error handling.
- Update dependencies.

## [2.0.11-beta](https://github.com/Aluxian/Whatsie/tree/v2.0.11) (2016-14-04)

[Full Changelog](https://github.com/Aluxian/Whatsie/compare/v2.0.10...v2.0.11) &bull; [Download](https://github.com/Aluxian/Whatsie/releases/tag/v2.0.11)
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

## [2.0.10-beta](https://github.com/Aluxian/Whatsie/tree/v2.0.10) (2016-06-04)

[Full Changelog](https://github.com/Aluxian/Whatsie/compare/v2.0.9...v2.0.10) &bull; [Download](https://github.com/Aluxian/Whatsie/releases/tag/v2.0.10)
- Fix the WAFD cleaner removing other files, too.
- Fix the app window not showing when a notification was clicked on OS X.
- Make the WAFD cleaner dialog show the files that are going to be removed.
- Update how items are grouped in the Help menu.

## [2.0.9-beta](https://github.com/Aluxian/Whatsie/tree/v2.0.9) (2016-04-04)

[Full Changelog](https://github.com/Aluxian/Whatsie/compare/v2.0.8...v2.0.9) &bull; [Download](https://github.com/Aluxian/Whatsie/releases/tag/v2.0.9)
- Improve the WhatsApp for Desktop cleaner.
- Fix app closing even with tray icon enabled on Linux.
- Fix category displayed incorrectly on Linux.

## [2.0.8-beta](https://github.com/Aluxian/Whatsie/tree/v2.0.8) (2016-02-04)

[Full Changelog](https://github.com/Aluxian/Whatsie/compare/v2.0.7...v2.0.8) &bull; [Download](https://github.com/Aluxian/Whatsie/releases/tag/v2.0.8)
- Update Electron to v0.37.3.
- Add 4 new themes: Faded, Fluttershy, Orange, Sephia.
- Re-add keyboard shortcuts for navigation conversations.
- Remove 'Paste and Match Style' context menu item.
- Fix language names on Windows.
- Fix WAFD cleaner.

## [2.0.7-beta](https://github.com/Aluxian/Whatsie/tree/v2.0.7) (2016-26-03)

[Full Changelog](https://github.com/Aluxian/Whatsie/compare/v2.0.6...v2.0.7) &bull; [Download](https://github.com/Aluxian/Whatsie/releases/tag/v2.0.7)
- Prompt user to update instead of doing it automatically on quit (Windows).
- Disable the crash reporter if stats reporting is disabled.

## [2.0.6-beta](https://github.com/Aluxian/Whatsie/tree/v2.0.6) (2016-25-03)

[Full Changelog](https://github.com/Aluxian/Whatsie/compare/v2.0.5...v2.0.6) &bull; [Download](https://github.com/Aluxian/Whatsie/releases/tag/v2.0.6)
- Improves support for debugging.
- Improves app launch by adding transitions.
- Adds support for multiple languages for the spell checker.
- Adds option to enable or disable the update checks.
- Adds WAFD cleaner for Windows.
- Updates dependencies.
- Fix for completely black window using Dark theme.
- Fix for crash in Windows auto launcher.

## [2.0.5-beta](https://github.com/Aluxian/Whatsie/tree/v2.0.5) (2016-11-03)

[Full Changelog](https://github.com/Aluxian/Whatsie/compare/v2.0.4...v2.0.5) &bull; [Download](https://github.com/Aluxian/Whatsie/releases/tag/v2.0.5)
- Adds support for raffles.

## [2.0.4-beta](https://github.com/Aluxian/Whatsie/tree/v2.0.4) (2016-07-03)

[Full Changelog](https://github.com/Aluxian/Whatsie/compare/v2.0.3...v2.0.4) &bull; [Download](https://github.com/Aluxian/Whatsie/releases/tag/v2.0.4)
- Fixes OS X auto updater.
- Improved logging.

## [2.0.3-beta](https://github.com/Aluxian/Whatsie/tree/v2.0.3) (2016-06-03)

[Full Changelog](https://github.com/Aluxian/Whatsie/compare/v2.0.2...v2.0.3) &bull; [Download](https://github.com/Aluxian/Whatsie/releases/tag/v2.0.3)
- Upgrades Electron to v0.36.10.
- Upgrades dependencies.

## [2.0.2-beta](https://github.com/Aluxian/Whatsie/tree/v2.0.2) (2016-29-02)

[Full Changelog](https://github.com/Aluxian/Whatsie/compare/v2.0.1...v2.0.2) &bull; [Download](https://github.com/Aluxian/Whatsie/releases/tag/v2.0.2)
- Fixes for the auto updater.
- Include build number in releases.
- Improved logging.

## [2.0.1-beta](https://github.com/Aluxian/Whatsie/tree/v2.0.1) (2016-12-02)

[Full Changelog](https://github.com/Aluxian/Whatsie/compare/v2.0.0...v2.0.1) &bull; [Download](https://github.com/Aluxian/Whatsie/releases/tag/v2.0.1)
- Dummy release to test the updating process.

## [2.0.0-beta](https://github.com/Aluxian/Whatsie/tree/v2.0.0) (2015-20-12)

[Download](https://github.com/Aluxian/Whatsie/releases/tag/v2.0.0)
- Initial release.
