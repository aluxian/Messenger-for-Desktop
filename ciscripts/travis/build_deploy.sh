#!/bin/bash -ev

./ciscripts/travis/build.sh
gulp publish:github --verbose
