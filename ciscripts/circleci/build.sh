#!/bin/bash -ev

./ciscripts/circleci/dependencies.sh;
./ciscripts/circleci/install_aws.sh;

gulp changelog:linux --verbose

gulp rebuild:32 --verbose
gulp pack:linux32:deb --prod --verbose
gulp pack:linux32:rpm --prod --verbose
gulp pack:linux32:tar --prod --verbose

gulp rebuild:64 --verbose
gulp pack:linux64:deb --prod --verbose
gulp pack:linux64:rpm --prod --verbose
gulp pack:linux64:tar --prod --verbose
