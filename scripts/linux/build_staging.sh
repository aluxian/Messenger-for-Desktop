#!/bin/bash -ev

./build.sh
gulp publish:bintray:artifacts:linux --verbose
