#!/bin/bash -ev

sudo apt-get update
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 10
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.6 10
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.9 20
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-4.9 20
sudo apt-get install libc6-dev-i386 gcc-4.9-multilib g++-4.9-multilib \
  lib32stdc++-4.9-dev lib32gcc-4.9-dev lib32asan1 ruby-dev make rpm
sudo ln -s /usr/include/asm-generic /usr/include/asm
rvmsudo gem install fpm

npm install -g gulp
npm install
cd src && npm install && cd ..
gulp download:linux32 --verbose
gulp download:linux64 --verbose
