![Electron SuperKit Logo](docs/logo.png)

[![Build status](https://ci.appveyor.com/api/projects/status/7u19ki1r7pofwr25/branch/deploy?svg=true)](https://ci.appveyor.com/project/Aluxian/electron-superkit/branch/deploy)
[![Dependency Status](https://david-dm.org/Aluxian/electron-superkit/status.svg)](https://david-dm.org/Aluxian/electron-superkit#info=dependencies)
[![Join the chat at https://gitter.im/Aluxian/electron-superkit](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Aluxian/electron-superkit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

:zap: *An Electron starter kit with super powers.* :zap:

[Electron](http://electron.atom.io/) lets you write cross-platform desktop applications using JavaScript, HTML and CSS. It is based on io.js and Chromium and is used in the [Atom](https://atom.io/) editor.

Electron SuperKit uses [Gulp](http://gulpjs.com/) to build, sign, pack and publish your awesome apps. All the Electron goodies are included:

- native crash reporting
- windows installer
- debugging & profiling
- native menus & notifications

Squirrel updates for OS X and Windows are NOT implemented. Instead, I created a custom updater that just compares the local package.json with a remote one on startup.

:fire: Extra:

- dmg installer for OS X
- deb & rpm packages for Linux
- write ES6 JavaScript, ship ES5 code
- write LESS stylesheets, ship CSS code
- use [AppVeyor](http://www.appveyor.com/) to build Windows releases
- task to publish releases to GitHub
- live reload in development

Other ideas, not done yet:

- sign the RPM
- use a custom logger (bunyan, winston)

> **Note**: The kit is not finished. I'm still working on polishing some features and making others work. Why not join me? I'm on Gitter :)

## Getting started

Everything you need to know ~~is~~ should be in the wiki. I'm still working on it, so there might still be some missing pieces. If you need help with anything just ask and I'll write about it.

[Get Started](https://github.com/Aluxian/electron-superkit/wiki/Home)!

## Contributions

Contributions are welcome! For feature requests and bug reports please [submit an issue](https://github.com/Aluxian/electron-superkit/issues) or get in touch with me on [Gitter](https://gitter.im/Aluxian/electron-superkit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge).
