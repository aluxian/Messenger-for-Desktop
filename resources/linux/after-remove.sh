#!/bin/bash

# Delete the link to the binary
rm -f /usr/bin/{{ name }}

# Delete app.desktop from $XDG_CONFIG_HOME
rm -f "${XDG_CONFIG_HOME:-$HOME/.config}/autostart/{{ name }}.desktop"

# Delete leftover app data
rm -rf "${XDG_CONFIG_HOME:-$HOME/.config}/{{ productName }}"
