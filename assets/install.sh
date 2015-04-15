#!/bin/sh
if [ "$(whoami)" != "root" ]; then
		echo "Run as root if you get 'Permission denied' errors."
	fi

# Move files into the install dir
mkdir -p /opt/MessengerForDesktop
cp -rf ./* /opt/MessengerForDesktop/

# Set permissions
chmod -R 755 /opt/MessengerForDesktop
chmod +x /opt/MessengerForDesktop/messengerfordesktop.desktop
chmod +x /opt/MessengerForDesktop/Messenger

# Make shortcut in /usr/share/applications
desktop-file-install /opt/MessengerForDesktop/messengerfordesktop.desktop
