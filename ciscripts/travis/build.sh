#!/bin/bash -ev

./ciscripts/travis/install_aws.sh
./ciscripts/travis/import_cert.sh

gulp rebuild:64 --verbose
gulp pack:darwin64:dmg --prod --verbose
gulp pack:darwin64:zip --prod --verbose
