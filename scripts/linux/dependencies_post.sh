#!/bin/bash

npm install
cd src && npm install
gulp download:linux32 --verbose
gulp download:linux64 --verbose
