#!/bin/bash  -vx

./build.sh
gulp publish:bintray:artifacts:linux --verbose
