# Whatsie

[![Dependency Status](https://david-dm.org/Aluxian/Whatsie/status.svg)](https://david-dm.org/Aluxian/Whatsie#info=dependencies) [![Join the chat at gitter.im/Aluxian/Whatsie](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Aluxian/Whatsie)

- OS X [![OS X build](https://travis-ci.org/Aluxian/Whatsie.svg)](https://travis-ci.org/Aluxian/Whatsie)
- Windows [![Windows build](https://ci.appveyor.com/api/projects/status/6vborc92ob25kqe0/branch/deploy?svg=true)](https://ci.appveyor.com/project/Aluxian/whatsie/branch/deploy)
- Linux [![Linux builds](https://circleci.com/gh/Aluxian/Whatsie/tree/deploy.svg?style=svg)](https://circleci.com/gh/Aluxian/Whatsie/tree/deploy)

A simple &amp; beautiful desktop client for [WhatsApp Web](https://web.whatsapp.com/). Chat without distractions on Windows, OS X and Linux. Not affiliated with WhatsApp or Facebook. This is **NOT** an official product.

> **Note:** Whatsie is still in beta, so some features might not work properly. Bug reports and feature suggestions are welcome.

> **Note 2:** Please check for updates here regularly in case the update process breaks and your installed version can't update by itself.

> **Note for devs:** If you're willing to help maintain the app, I can make you a collaborator to help me. [Join me on Gitter](https://gitter.im/Aluxian/Whatsie) if you want to chat.

## Features

- Themes & Mini Mode
- Native Notifications (with reply on OS X)
- Spell Checker & Auto Correct
- Keyboard Shortcuts
- Launch on OS startup
- Automatic Updates

## How to install

### OS X

1. Download [whatsie-x.x.x-osx.dmg][LR] or [whatsie-x.x.x-osx.zip][LR]
2. Open or unzip the file and drag the app into the `Applications` folder

The app will update automatically.

### Windows

#### Installer

1. Download [whatsie-x.x.x-win32-setup.exe][LR]
2. Run the installer, wait until it finishes

The app will update automatically.

#### Portable

1. Download [whatsie-x.x.x-win32-portable.zip][LR]
2. Extract the zip and run the app

The app will NOT update automatically, but you can still check for updates.

### Deb-based Linux

1. Download [whatsie-x.x.x-linux-arch.deb][LR]
2. Double click and install, or run `dpkg -i whatsie-x.x.x-linux-arch.deb`

The app will NOT update automatically, but you can still check for updates.

You can also use `apt`:

```
gpg --keyserver pool.sks-keyservers.net --recv-keys 1537994D
gpg --export --armor 1537994D | sudo apt-key add -
echo "deb https://dl.bintray.com/aluxian/deb stable main" | sudo tee -a /etc/apt/sources.list
sudo apt-get update
sudo apt-get install whatsie
```

### RPM-based Linux

1. Download [whatsie-x.x.x-linux-arch.rpm][LR]
2. Double click and install, or run `rpm -ivh whatsie-x.x.x-linux-arch.rpm`

The app will NOT update automatically, but you can still check for updates.

You can also use `yum`:

```
sudo wget https://bintray.com/aluxian/rpm/rpm -O \
  /etc/yum.repos.d/bintray-aluxian-rpm.repo
sudo yum install whatsie.i386     # for 32-bit distros
sudo yum install whatsie.x86_64   # for 64-bit distros
```

# For Developers

## Build

### Install pre-requisites

If you want to build `deb` and `rpm` packages for Linux, you also need [fpm](https://github.com/jordansissel/fpm). To install it on OS X:

```
sudo gem install fpm
brew install rpm
```

### Install dependencies

Global dependencies:

```
npm install -g gulp
```

Local dependencies:

```
npm install
cd src && npm install
```

### Native modules

The app uses native modules. Make sure you rebuild the modules before building the app:

```
gulp rebuild:<32|64>
```

### Build and watch

During development you can use the `watch` tasks, which have live reload. As you edit files in `./src`, they will be re-compiled and moved into the `build` folder:

```
gulp watch:<darwin64|linux32|linux64|win32>
```

If you want to build it just one time, use `build`:

```
gulp build:<darwin64|linux32|linux64|win32>
```

For production builds, set `NODE_ENV=production` or use the `--prod` flag. Production builds don't include javascript sourcemaps or dev modules.

```
gulp build:<darwin64|linux32|linux64|win32> --prod
NODE_ENV=production gulp build:<darwin64|linux32|linux64|win32>
```

To see detailed logs, run every gulp task with the `--verbose` flag.

If you don't specify a platform when running a task, the task will run for the current platform.

### App debug logs

To see debug messages while running the app, set the `DEBUG` env var. This will print logs from the main process.

```
export DEBUG=whatsie:*
```

To enable the renderer logs launch the app, open the dev tools then type in the console:

```
localStorage.debug = 'whatsie:*';
```

To open the webview dev tools, type this in the main dev tools console:

```
wv.openDevTools();
```

If you want to automatically open the webview dev tools, type this:

```
localStorage.debugDevTools = true;
```

### Pack

#### OS X

You'll need to set these env vars:

```
SIGN_DARWIN_IDENTITY
SIGN_DARWIN_KEYCHAIN_NAME
SIGN_DARWIN_KEYCHAIN_PASSWORD
```

Pack the app in a neat .dmg:

```
gulp pack:darwin64:<dmg:zip> [--prod]
```

This uses [node-appdmg](https://www.npmjs.com/package/appdmg) which works only on OS X machines.

#### Windows

You'll need to set these env vars:

```
SIGNTOOL_PATH=
SIGN_WIN_CERTIFICATE_FILE=
SIGN_WIN_CERTIFICATE_PASSWORD=
GITHUB_TOKEN (optional, in case you get errors from GitHub)
```

Create an installer. This will also sign every executable inside the app, and the setup exe itself:

```
gulp pack:win32:installer [--prod]
```

Or, if you prefer, create a portable zip. This will also sign the executable:

```
gulp pack:win32:portable [--prod]
```

These tasks only work on Windows machines due to their dependencies: [Squirrel.Windows](https://github.com/Squirrel/Squirrel.Windows) and Microsoft's SignTool.

#### Linux

Create deb/rpm packages:

```
gulp pack:<linux32|linux64>:<deb|rpm> [--prod]
```

Make sure you've installed [fpm](https://github.com/jordansissel/fpm).

## Note to WhatsApp

This project does not attempt to reverse engineer the WhatsApp API or attempt to reimplement any part of the WhatsApp client. Any communication between the user and WhatsApp servers is handled by WhatsApp Web itself; this is just a native wrapper for WhatsApp Web.

## Contributions

Contributions are welcome! For feature requests and bug reports please [submit an issue](https://github.com/Aluxian/Whatsie/issues/new?labels=bug) or get in touch with me on [Gitter](https://gitter.im/Aluxian/Whatsie) or Twitter [@aluxian](https://twitter.com/aluxian).

[LR]: https://github.com/Aluxian/Whatsie/releases/latest
