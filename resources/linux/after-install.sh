#!/bin/bash

# Link to the binary
ln -sf /opt/WhatsAppForDesktop/UnofficialWhatsApp /usr/local/bin/whatsappfordesktop

# Launcher icon
desktop-file-install /opt/WhatsAppForDesktop/whatsappfordesktop.desktop
