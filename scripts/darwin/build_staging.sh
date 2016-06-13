#!/bin/bash -ev

./scripts/darwin/build.sh
gulp publish:bintray:artifacts:darwin --verbose
