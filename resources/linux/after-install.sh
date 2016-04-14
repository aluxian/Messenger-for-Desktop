#!/bin/bash

# Link to the binary
ln -sf /opt/{{ name }}/{{ name }} /usr/bin/{{ name }}

# Copy app.desktop from /etc/xdg/autostart/ to $XDG_CONFIG_HOME
cp /etc/xdg/autostart/{{ name }}.desktop "${XDG_CONFIG_HOME:-$HOME/.config}/autostart"
