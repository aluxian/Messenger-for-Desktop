#!/bin/bash

# Link to the binary
ln -sf /opt/{{ name }}/{{ name }} /usr/local/bin/{{ name }}

# Create an entry to launch on startup
mkdir -p $HOME/.config/autostart/
cp -f /opt/{{ name }}/startup.desktop $HOME/.config/autostart/{{ name }}.desktop
