#!/bin/bash -ev

npm install -g gulp
npm install;

./scripts/darwin/install_aws.sh;
./scripts/darwin/rebuild_src.sh;
