#!/bin/bash -ev

./ciscripts/travis/build.sh
gulp publish:bintray:artifacts:darwin --verbose
