#!/bin/sh

if [ "$(whoami)" != "root" ]; then
	echo "Run as root if you get 'Permission denied' errors."
fi

mkdir -p /usr/share/MessengerForDesktop
yes | cp -rf ./* /usr/share/MessengerForDesktop/

read -p "Add a shortcut to Messenger on your Desktop? [yN]" yn

case $yn in
  [Yy]* ) ln -s /usr/share/MessengerForDesktop/Messenger $HOME/Desktop/Messenger;;
  [Nn]* ) exit;;
esac
