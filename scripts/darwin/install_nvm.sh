#!/bin/bash -ev

git clone https://github.com/creationix/nvm.git /tmp/.nvm

echo source /tmp/.nvm/nvm.sh
set +v
source /tmp/.nvm/nvm.sh
set -v

nvm install 0.12
nvm use 0.12
