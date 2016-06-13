#!/bin/bash -x

./build.sh
gulp publish:bintray:artifacts:linux --verbose
