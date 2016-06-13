#!/bin/bash -v

./build.sh
gulp publish:bintray:artifacts:linux --verbose
