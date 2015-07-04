# Electron Super Starter

This is an example app built with [Electron](http://electron.atom.io/) called Testie.

## Pre-Requisites

You need the following:

* node & npm: I recommend the latest versions.
* [**fpm**](https://github.com/jordansissel/fpm): Required by the `pack:linux{32|64}:{deb|rpm}` tasks in `gulpfile` to create the Linux packages. You also need `rpm` to be able to build `rpm` packages.
* [**wine**](https://www.winehq.org/): Only if you're not on Windows. Required to build for Windows.

Quick install on OS X:

    $ sudo gem install fpm
    $ brew install wine rpm

### Dependencies

    $ # Install global dependencies
    $ npm install -g gulp

    $ # Install local dependencies
    $ npm install

The last command should also install the modules for `./src`. If `./src/node_modules/` doesn't exist then:

    $ cd ./src/
    $ npm install

## Build

### OS X

    # Pack the app in a .dmg
    gulp pack:darwin64

This only works on OS X machines.

### Windows

    # Create an installer
    gulp pack:win32:installer

    # Create a portable zip
    gulp pack:win32:portable

The installer can only be created on Windows machines until [Squirrel.Windows](https://github.com/Squirrel/Squirrel.Windows) works with [wine](https://www.winehq.org/).

### Linux

    # Create deb
    gulp pack:linux32:deb
    gulp pack:linux64:deb

    # Create rpm
    gulp pack:linux32:rpm
    gulp pack:linux64:rpm

### Tips

The output is in `./dist`. Take a look at `gulpfile.coffee` for additional tasks.

## Contributions

Contributions are welcome! For feature requests and bug reports please [submit an issue](https://github.com/Aluxian/electron-super-starter/issues).
