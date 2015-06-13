#!/bin/bash

# Check $1
if [ -z "$1" ]
  then
    echo "Version is required."
fi

# Replace version in package.json files
sed -i.bak "s/\"version\": \".*\"/\"version\": \"$1\"/g" ./package.json
sed -i.bak "s/\"version\": \".*\"/\"version\": \"$1\"/g" ./src/package.json
sed -i.bak "s/download\/v.*\/Messenger/download\/v$1\/Messenger/g" ./src/package.json

# Clean up
rm ./package.json.bak
rm ./src/package.json.bak

# Edit CHANGELOG
vim ./CHANGELOG

# Git commit
git add .
git commit -m "New version v$1"
git tag -a "v$1" -m "v$1"

# TODO Paste all commits since the last tag into CHANGELOG
