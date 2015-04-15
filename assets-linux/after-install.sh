#!/bin/bash

# Link to the binary
ln -sf /opt/MessengerForDesktop/Messenger /usr/local/bin/messengerfordesktop

# Unity Launcher icon
desktop-file-install /opt/MessengerForDesktop/messengerfordesktop.desktop
