#!/bin/bash -ev

./ciscripts/darwin/build.sh
gulp publish:bintray:artifacts:darwin --verbose
