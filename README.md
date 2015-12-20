Whatsie
=======

[![Build status](https://ci.appveyor.com/api/projects/status/t9nvllbmy6h54o5t/branch/master?svg=true)](https://ci.appveyor.com/project/Aluxian/whatsie/branch/master)[![Dependency Status](https://david-dm.org/Aluxian/Whatsie/status.svg)](https://david-dm.org/Aluxian/Whatsie#info=dependencies)[![Join the chat at gitter.im/Aluxian/Whatsie](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Aluxian/Whatsie)

A simple & beautiful app for [WhatsApp Web](https://web.whatsapp.com/) which runs on OS X, Windows and Linux. Not affiliated with WhatsApp or Facebook. This is **NOT** an official product.

:zap: *Created with [Electron SuperKit](https://github.com/Aluxian/electron-superkit), an Electron starter kit with super powers.* :zap:

Build
-----

### Install pre-requisites

If you want to build `deb` and `rpm` packages for Linux, you also need [fpm](https://github.com/jordansissel/fpm). To install it on OS X:

```
$ sudo gem install fpm
$ brew install rpm
```

### Install dependencies

Global dependencies:

```
$ npm install -g gulp
```

Local dependencies:

```
$ npm install
```

The last command should also install the modules for `./src`. If `./src/node_modules/` doesn't exist then:

```
$ cd ./src
$ npm install
```

### Build and watch

During development you can use the `watch` tasks, which have live reload. As you edit files in `./src`, they will be re-compiled and moved into the `build` folder:

```
$ gulp watch:darwin64
$ gulp watch:linux32
$ gulp watch:linux64
$ gulp watch:win32
```

If you want to build it just one time, use `build`:

```
$ gulp build:darwin64
$ gulp build:linux32
$ gulp build:linux64
$ gulp build:win32
```

For production builds, set `NODE_ENV=production` or use the `--prod` flag. Production builds don't include javascript sourcemaps or dev modules.

```
$ gulp build:darwin64 --prod
$ gulp build:linux32 --prod
$ NODE_ENV=production gulp build:linux64
$ NODE_ENV=production gulp build:win32
```

To see detailed logs, run every gulp task with the `--verbose` flag.

### App debug logs

To see debug messages while running the app, set the `DEBUG` env var. This will print logs from the main process.

```
export DEBUG=whatsie:*
```

To enable the renderer logs launch the app, open the dev tools then type in the console:

```
localStorage.debug='whatsie:*'
```

### Pack

#### OS X

Pack the app in a neat .dmg:

```
$ gulp pack:darwin64
$ gulp pack:darwin64 --prod
```

This uses [node-appdmg](https://www.npmjs.com/package/appdmg) which works only on OS X machines. There's an issue about making it cross-platform [here](https://github.com/LinusU/node-appdmg/issues/14).

#### Windows

Create an installer. This will also sign every executable inside the app, and the setup exe itself:

```
$ gulp pack:win32:installer
$ gulp pack:win32:installer --prod
```

Or, if you prefer, create a portable zip. This will also sign the executable:

```
$ gulp pack:win32:portable
$ gulp pack:win32:portable --prod
```

These tasks only work on Windows machines due to their dependencies: [Squirrel.Windows](https://github.com/Squirrel/Squirrel.Windows) and Microsoft's SignTool.

If you don't have a Windows machine at hand, you can use AppVeyor. When you push a tagged commit in a branch named `deploy`, AppVeyor will automatically start the build and upload the release files as artifacts. You'll be able to download the artifacts from your AppVeyor dashboard. You have to replace some secret keys in `appveyor.yml` to make it work.

#### Linux

Create deb packages:

```
$ gulp pack:linux32:deb
$ gulp pack:linux64:deb
```

Create rpm packages:

```
$ gulp pack:linux32:rpm
$ gulp pack:linux64:rpm
```

Or for production:

```
$ gulp pack:linux32:deb --prod
$ gulp pack:linux64:deb --prod
$ gulp pack:linux32:rpm --prod
$ gulp pack:linux64:rpm --prod
```

Make sure you've installed [fpm](https://github.com/jordansissel/fpm).

Installation
------------

### OS X

Open the `dmg` and copy the app into `/Applications`.

### Windows

Run the installer and follow the steps.

### Deb package

Either double click and install or:

```
$ dpkg -i whatsie.deb
```

### Rpm package

Import the gpg key and install:

```
$ rpm --import https://raw.githubusercontent.com/Aluxian/Whatsie/master/RPM-GPG-KEY-whatsie
$ rpm -ivh whatsie.rpm
```

Note to WhatsApp
----------------

This project does not attempt to reverse engineer the WhatsApp API or attempt to reimplement any part of the WhatsApp client. Any communication between the user and WhatsApp servers is handled by WhatsApp Web itself; this is just a native wrapper for WhatsApp Web.

Contributions
--------------------

Contributions are welcome! For feature requests and bug reports please [submit an issue](https://github.com/Aluxian/Whatsie/issues/new?labels=bug) or get in touch with me on [Gitter](https://gitter.im/Aluxian/Whatsie) or Twitter [@aluxian](https://twitter.com/aluxian).
