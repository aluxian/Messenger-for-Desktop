#!/bin/bash

# Delete the link to the binary
rm -f /usr/local/bin/{{ name }}

# Delete the entry to launch on startup
rm -f $HOME/.config/autostart/{{ name }}.desktop
