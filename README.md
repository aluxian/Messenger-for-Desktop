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
* Native notifications

## Build

### Pre-requisites

    # install gulp
    npm install -g gulp

    # install dependencies
    npm install

    # optional, read the comment about winIco in gulpfile
    brew install wine

    # optional; see task `package-win32` in gulpfile
    brew install makensis

### OS X

    gulp release-osx64

### Windows

    gulp release-win32

### Linux 32 bit

    gulp release-linux32

### Linux 64 bit

    gulp release-linux64

Take a look into `gulpfile.coffee` for additional tasks.

### Chrome

    Switch to the `chrome` branch.

### Windows Metro

    Switch to the `windows` branch.

## Changelog

    1.2.0
    - Links open in the browser
    - OS X: keep the app open when closing the window
    - The app checks for update when launched

    1.1.0
    - Badge with the number of unread notifications in the dock/taskbar (OSX/Win)

    1.0.0
    - First release

## To Do

* Preferences menu ??
* Launch on OS startup ??

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
