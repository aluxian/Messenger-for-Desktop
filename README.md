![Electron SuperKit Logo](docs/logo.png)

[![Dependency Status](https://david-dm.org/Aluxian/electron-superkit/status.svg)](https://david-dm.org/Aluxian/superkit#info=dependencies)

:zap: *An Electron starter kit with super powers.* :zap:

[Electron](http://electron.atom.io/) lets you write cross-platform desktop applications using JavaScript, HTML and CSS. It is based on io.js and Chromium and is used in the [Atom](https://atom.io/) editor.

Electron SuperKit uses [Gulp](http://gulpjs.com/) to build, sign, pack and publish your awesome apps. All the Electron goodies are included:

- automatic updates (OS X, Windows)
- crash reporting
- windows installer
- debugging & profiling
- native menus & notifications

:fire: Extra:

- dmg installer for OS X
- deb & rpm packages for Linux
- write ES6 JavaScript, ship ES5 code
- write LESS stylesheets, ship CSS code
- automatically publish releases to GitHub
- use [AppVeyor](http://www.appveyor.com/) to build Windows releases (no need for a Windows machine)
- live reload in development

## Let's get started!

You need the following:

* [**node & npm**](https://nodejs.org/): I recommend the latest versions.
* [**fpm**](https://github.com/jordansissel/fpm): Required to create deb and rpm packages.
* [**wine**](https://www.winehq.org/): Only needed if you're not on Windows. Required to customize the Windows executable.

Quickly install all this stuff on OS X:

    $ sudo gem install fpm
    $ brew install node wine rpm

#### Dependencies

:white_check_mark: Global dependencies:

    $ npm install -g gulp

:white_check_mark: Local dependencies:

    $ npm install

The last command should also install the modules for `./src`. If `./src/node_modules/` doesn't exist then:

    $ cd ./src
    $ npm install

## Whew! Now, let's get to work

Project structure:

| Path                            | Description
| ------------------------------- | -----------
| build/                          | The Electron framework, the compiled source code and the processed resources are moved here during build.
| dist/                           | Here you'll find the installers/packages.
| cache/                          | Downloaded zip files of Electron releases are placed here.
| docs/                           | Exactly. I also recommend reading [Electron's documentation](https://github.com/atom/electron/tree/master/docs#readme).
| resources/                      | Icons and config files used to create the installers/packages.
| src/                            | The sweet things. HTML pages, scripts, stylesheets, modules and everything your app needs.
| tasks/                          | Finely written Gulp tasks to aid you in your super-businesses.
| .babelrc                        | Config file for the Babel transpiler.
| .env-example                    | You should have these variables in your environment for various tasks.
| .eslintignore, .eslintrc        | Useful if you use the [linter-eslint](https://atom.io/packages/linter-eslint) plugin for Atom.
| .gitignore                      | C'mon, you're familiar with this stuff.
| appveyor.yml                    | This file is used by AppVeyor to know how to build the Windows installer.
| CHANGELOG.md                    | Write here your changes after each release. If you want to, of course.
| design.sketch                   | The assets I designed for SuperKit. You can use it as a template to create your own.
| gulpfile.coffee                 | Just an entry point to tell Gulp where to find our tasks.
| LICENSE.md                      | Yep.
| package.json                    | Dependencies and stuff. Replace the names and urls with your own.
| README.md                       | This mighty file.

Gulp tasks:

| Name                            | Description
| ------------------------------- | -----------
| build:&                         | Used to move assets and edit properties of some files, depending on the platform.
| clean:build:&                   | Clean the build folder (remove the default app that ships with Electron).
| clean:dist:&                    | Remove files in dist and make sure the directory exists.
| compile:&                       | Compile, process and move your code into the build folder.
| download:&                      | Download the Electron framework. Cache the files, then unzip them and move them into the build folder.
| pack:&                          | Create the installers/packages. These also handle app signing.
| publish:github                  | Upload the dist files to GitHub.
| purge:{build,cache,dist}        | Abolish the chosen directory.
| resources:{darwin,linux,win}    | Process the resources and move them to the build folder.
| watch:&                         | Compile and move the source files into the build directory every time they change. This uses livereload.

Don't forget to set the vars listed in `.env-example`. You'll need them for some of your tasks.

Here's how the tasks depend on each other:

![](docs/tasks.png)

The `&` symbol is a placeholder for `{darwin64,linux32,linux64,win32}`.

## Time to build it!

You'll be doing most of your magic work inside the `src` folder. Use the watch tasks to make development easier. When you're ready, press the red button! Ugh, I mean, run the pack task. Your freshly baked release will be waiting for you in the `dist` folder.

### OS X

Pack the app in a neat .dmg:

    $ gulp pack:darwin64

This uses [node-appdmg](https://www.npmjs.com/package/appdmg) which works only on OS X machines. There's an issue about making it cross-platform [here](https://github.com/LinusU/node-appdmg/issues/14).

### Windows

Create an installer. This will also sign every executable inside the app, and the setup exe itself:

    $ gulp pack:win32:installer

Or, if you prefer, create a portable zip. This will also sign the executable:

    $ gulp pack:win32:portable

The installer can only be created on Windows machines until [Squirrel.Windows](https://github.com/Squirrel/Squirrel.Windows) works with [wine](https://www.winehq.org/).

### Linux

Create deb packages:

    $ gulp pack:linux32:deb
    $ gulp pack:linux64:deb

Create rpm packages:

    $ gulp pack:linux32:rpm
    $ gulp pack:linux64:rpm

Make sure you've installed [fpm](https://github.com/jordansissel/fpm).

## Prime time

Ready to publish your super app? Upload it to GitHub:

    $ gulp publish:github

## Contributions

Contributions are welcome! For feature requests and bug reports please [submit an issue](https://github.com/Aluxian/electron-superkit/issues).
