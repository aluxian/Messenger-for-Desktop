#!/bin/bash -ev

./ciscripts/darwin/build.sh
gulp publish:github --verbose
