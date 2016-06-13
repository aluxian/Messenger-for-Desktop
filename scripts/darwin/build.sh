#!/bin/bash -ev

./scripts/darwin/import_cert.sh
gulp pack:darwin64:dmg --prod --verbose
gulp pack:darwin64:zip --prod --verbose
