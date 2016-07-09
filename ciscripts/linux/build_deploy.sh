#!/bin/bash -ev

./scripts/linux/build.sh
gulp publish:bintray:deb --verbose
gulp publish:bintray:rpm --verbose
gulp publish:github --verbose
gulp publish:aur --verbose
