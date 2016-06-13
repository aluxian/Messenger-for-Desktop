#!/bin/bash -ev

./scripts/darwin/build.sh
gulp publish:github --verbose
