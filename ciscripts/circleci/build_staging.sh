#!/bin/bash -ev

./ciscripts/circleci/build.sh
gulp publish:bintray:artifacts:linux --verbose
