#!/bin/bash -ev

export npm_config_target=`node -pe "require('./src/package.json').electronVersion.substring(1)"`
cd src && HOME=~/.electron-gyp npm_config_disturl="https://atom.io/download/atom-shell" npm_config_arch="x64" npm_config_runtime="electron" npm install && cd ..
