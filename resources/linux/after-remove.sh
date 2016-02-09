#!/bin/bash

# Delete the link to the binary
rm -f /usr/bin/{{ name }}

# Delete leftover app data
rm -rf "${XDG_CONFIG_HOME:-$HOME/.config}/{{ productName }}"
