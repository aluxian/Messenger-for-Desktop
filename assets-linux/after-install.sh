#!/bin/bash

# Link to the binary
ln -sf /opt/MessengerForDesktop/Messenger /usr/local/bin/messengerfordesktop

# Launcher icon
desktop-file-install /opt/MessengerForDesktop/messengerfordesktop.desktop
