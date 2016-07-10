#!/bin/bash -ev

./ciscripts/linux/build.sh
gulp publish:bintray:artifacts:linux --verbose
