#!/bin/bash

# Link to the binary
rm -f /usr/local/bin/messengerfordesktop

# Launcher files
rm -f /usr/share/applications/messengerfordesktop.desktop

# Config files
rm -f -r /home/$SUDO_USER/.config/Messenger/

# Cache
rm -f -r /home/$SUDO_USER/.cache/Messenger
