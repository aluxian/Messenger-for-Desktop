#!/bin/bash -ev

./scripts/linux/build.sh
gulp publish:bintray:artifacts:linux --verbose
