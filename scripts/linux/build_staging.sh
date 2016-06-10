#!/bin/bash

./build.sh
gulp publish:bintray:artifacts:linux --verbose
