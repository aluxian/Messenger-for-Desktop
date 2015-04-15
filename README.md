# Facebook Messenger (Unofficial)

[![Join the chat at https://gitter.im/Aluxian/Facebook-Messenger-Desktop](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Aluxian/Facebook-Messenger-Desktop?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Bring [messenger.com](https://messenger.com) to your OS X, Windows, Linux or Chromebook desktop. Built with [NW.js](http://nwjs.io/).

![Cross-platform screenshot](screenshot.png)

## Features

* Sounds *(can be disabled in settings)*
* Desktop notifications *(enable them in settings)*
* Voice and video calls

## Extra

* Badge with the number of notifications (OS X and Windows)
* Native notifications on Linux and OSX
* System tray icon on Windows

## Build

### Pre-requisites

    # install gulp
    npm install -g gulp

    # install dependencies
    npm install

* **wine**: If you're on OSX/Linux and want to build for Windows, you need [Wine](http://winehq.org/) installed. Wine is required in order
to set the correct icon for the exe. If you don't have Wine, you can comment out the `winIco` field in `gulpfile`.
* **makensis**: Required by the `pack:win32` task in `gulpfile` to create the Windows installer.
* [**fpm**](https://github.com/jordansissel/fpm): Required by the `pack:linux{32|64}` tasks in `gulpfile` to create the linux installers.
* **rpmbuild**: Needed to build the .rpm packages for linux.

For OSX:

    brew install rpm makensis rpm
    sudo gem install fpm

### OS X

    gulp pack:osx64

### Windows

    gulp pack:win32

### Linux 32/64 bit

    gulp pack:linux{32|64}

Take a look into `gulpfile.coffee` for additional tasks.

### Chrome

Switch to the `chrome` branch.

### Windows Metro

Switch to the `windows` branch.

## To Do

* Preferences menu
* Launch on OS startup

## Contributions

Contributions are welcome! For feature requests and bug reports please [submit an issue](https://github.com/Aluxian/Facebook-Messenger-Desktop/issues).

## License

The MIT License (MIT)

Copyright (c) 2015 Alexandru Rosianu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
