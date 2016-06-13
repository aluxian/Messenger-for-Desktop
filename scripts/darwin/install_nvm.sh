#!/bin/bash -v

git clone https://github.com/creationix/nvm.git /tmp/.nvm
source /tmp/.nvm/nvm.sh
nvm install 0.12
nvm use 0.12
