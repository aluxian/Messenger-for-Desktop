#!/bin/bash

# Link to the binary
ln -sf /opt/{{ name }}/{{ name }} /usr/bin/{{ name }}

# Update icon cache
/bin/touch --no-create /usr/share/icons/hicolor &>/dev/null
/usr/bin/gtk-update-icon-cache /usr/share/icons/hicolor &>/dev/null || :
