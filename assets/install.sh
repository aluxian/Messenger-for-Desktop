#!/bin/sh

if [ "$(whoami)" != "root" ]; then
	echo "Run as root if you get 'Permission denied' errors."
fi

mkdir -p /opt/MessengerForDesktop
cp -rf ./* /opt/MessengerForDesktop/
chmod -R 755 /opt/MessengerForDesktop
chmod +x /opt/MessengerForDesktop/facebookmessenger.desktop
cp -f /opt/MessengerForDesktop/facebookmessenger.desktop /usr/share/applications/
chmod +x /opt/MessengerForDesktop/Messenger
chmod 644 /usr/share/applications/facebookmessenger.desktop

read -p "Add a shortcut to Messenger on your Desktop? [yN]" yn

case $yn in
  [Yy]* ) cp /opt/MessengerForDesktop/facebookmessenger.desktop $HOME/Desktop;;
  [Nn]* ) exit;;
esac
