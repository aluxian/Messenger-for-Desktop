# Whatsie (beta)

[![OS X build](https://travis-ci.org/Aluxian/Whatsie.svg?branch=staging)](https://travis-ci.org/Aluxian/Whatsie)
[![Windows build](https://ci.appveyor.com/api/projects/status/6vborc92ob25kqe0/branch/staging?svg=true)](https://ci.appveyor.com/project/Aluxian/Whatsie)
[![Linux builds](https://circleci.com/gh/Aluxian/Whatsie/tree/staging.svg?style=shield)](https://circleci.com/gh/Aluxian/Whatsie)
[![bitHound Overall Score](https://www.bithound.io/github/Aluxian/Whatsie/badges/score.svg)](https://www.bithound.io/github/Aluxian/Whatsie)
[![Downloads total](https://updates.whatsie.chat/badge/downloads.svg)](https://updates.whatsie.chat/stats)
[![Services status](https://img.shields.io/badge/services-status-blue.svg)](https://status.whatsie.chat/)
[![HuBoard task board](https://img.shields.io/badge/hu-board-7965cc.svg)](https://huboard.com/Aluxian/Whatsie)
[![Join the chat](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Aluxian/Whatsie)

A simple &amp; beautiful desktop client for [WhatsApp Web](https://web.whatsapp.com/). Chat without distractions on OS X, Windows and Linux. Not affiliated with WhatsApp or Facebook. This is **NOT** an official product.

Whatsie is still in beta, so some features might not work properly. Bug reports and feature suggestions are welcome. Please check for updates here regularly in case the update process breaks and your installed version can't update by itself.

> **@devs:** If you're willing to help improve, fix or maintain the app, I can make you a collaborator to help me. [Join me on Gitter](https://gitter.im/Aluxian/Whatsie) and let's chat!

![Whatsie Screenshot](./screenshot.png)

## Features

- Themes &amp; Mini Mode
- Native Notifications (with reply on OS X)
- Spell Checker &amp; Auto Correct
- Keyboard Shortcuts
- Launch on OS startup
- Automatic Updates

## How to install

**Note:** If you download from the [releases page](https://github.com/Aluxian/Whatsie/releases), be careful what version you pick. Releases that end with `-beta` are beta releases, the ones that end with `-dev` are development releases, and the rest are stable. If you're unsure which to pick, opt for stable. Once you download the app, you'll be able to switch to another channel from the menu.

- **dev:** these releases get the newest and hottest features, but they are less tested and might break things
- **beta:** these releases are the right balance between getting new features early while staying away from nasty bugs
- **stable:** these releases are more thoroughly tested; they receive new features later, but there's a lower chance that things will go wrong

If you want to help me make Whatsie better, I recommend `dev` or `beta`. Let's go!

### OS X

1. Download [whatsie-x.x.x-osx.dmg][LR] or [whatsie-x.x.x-osx.zip][LR]
2. Open or unzip the file and drag the app into the `Applications` folder
3. Done! The app will update automatically

### Windows

*Installer (recommended):*

1. Download [whatsie-x.x.x-win32-setup.exe][LR]
2. Run the installer, wait until it finishes
3. Done! The app will update automatically

*Portable:*

1. Download [whatsie-x.x.x-win32-portable.zip][LR]
2. Extract the zip wherever you want (e.g. a flash drive) and run the app from there
3. Done! The app will NOT update automatically, but you can still check for updates

### Linux

*Ubuntu, Debian 8+ (deb package):*

1. Download [whatsie-x.x.x-linux-arch.deb][LR]
2. Double click and install, or run `dpkg -i whatsie-x.x.x-linux-arch.deb` in the terminal
3. Start the app with your app launcher or by running `whatsie` in a terminal
4. Done! The app will NOT update automatically, but you can still check for updates

You can also use `apt-get` (recommended):

```
# Download my gpg key to make sure the deb you download is correct
gpg --keyserver pool.sks-keyservers.net --recv-keys 1537994D
gpg --export --armor 1537994D | sudo apt-key add -

# Add my repository to your sources list (skip if you've done this already)
# Replace <channel> with stable, beta or dev (pick stable if you're unsure)
echo "deb https://dl.bintray.com/aluxian/deb <channel> main" |
  sudo tee -a /etc/apt/sources.list.d/aluxian.list

# Install Whatsie
sudo apt-get update
sudo apt-get install whatsie
```

*Fedora, CentOS, Red Hat (RPM package):*

1. Download [whatsie-x.x.x-linux-arch.rpm][LR]
2. Double click and install, or run `rpm -ivh whatsie-x.x.x-linux-arch.rpm` in the terminal
3. Start the app with your app launcher or by running `whatsie` in a terminal
4. Done! The app will NOT update automatically, but you can still check for updates

You can also use `yum` (recommended):

```
# Add my repository to your repos list (skip if you've done this already)
sudo wget https://bintray.com/aluxian/rpm/rpm -O /etc/yum.repos.d/bintray-aluxian-rpm.repo

# Install Whatsie
sudo yum install whatsie.i386     # for 32-bit distros
sudo yum install whatsie.x86_64   # for 64-bit distros
```

*Arch Linux (AUR):*

1. Simply run `yaourt -S whatsie`
3. Start the app with your app launcher or by running `whatsie` in a terminal
3. Done! The app will NOT update automatically, but you can still check for updates

Repository URL: https://aur.archlinux.org/packages/whatsie/

[LR]: https://github.com/Aluxian/Whatsie/releases

# For Developers

Contributions are welcome! Please help me make Whatsie the best app for WhatsApp Web. For feature requests and bug reports please [submit an issue](https://github.com/Aluxian/Whatsie/issues/new?labels=bug) or get in touch with me on [Gitter](https://gitter.im/Aluxian/Whatsie) or Twitter [@aluxian](https://twitter.com/aluxian).

## Build

> **Note:** for some tasks, a GitHub access token might be required (if you get errors, make sure you have this token). After you generate it (see [here](https://help.github.com/articles/creating-an-access-token-for-command-line-use/) if you need help;  `repo` permissions are enough), set it as an env var:
> - Unix: `export GITHUB_TOKEN=123`
> - Windows: `set GITHUB_TOKEN=123`

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

For production builds, set `NODE_ENV=production` or use the `--prod` flag. Production builds don't include dev modules.

```
gulp build:<darwin64|linux32|linux64|win32> --prod
NODE_ENV=production gulp build:<darwin64|linux32|linux64|win32>
```

To see detailed logs, run every gulp task with the `--verbose` flag.

> If you don't specify a platform when running a task, the task will run for the current platform.

### App debug logs

To see debug messages while running the app, set the `DEBUG` env var. This will print logs from the main process.

```
export DEBUG=whatsie:*
```

To open the webview dev tools, type this in the main dev tools console:

```
wv.openDevTools();
```

If you want to automatically open the webview dev tools, use:

```
localStorage.autoLaunchDevTools = true; // on
localStorage.removeItem('autoLaunchDevTools'); // off
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

### Release flow

`develop -> staging -> deploy -> master`

1. All work is done on branch `develop`. Every push to `develop` will make the CIs run code linting and other checks.
2. In order to build, push to `staging`. Every push to `staging` will make the CIs build the app and upload it to Bintray at [aluxian/artifacts](https://bintray.com/aluxian/artifacts/whatsie/view#files/staging), available for testing.
3. After a version is tested and is ready for release, push it to `deploy`. This will rebuild the app and upload it to GitHub, Bintray and other repositories.
4. Now, the code is ready to be merged into `master`.
