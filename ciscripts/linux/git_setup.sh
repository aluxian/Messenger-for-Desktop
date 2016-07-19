#!/bin/bash -ev

aws s3 cp --region eu-west-1 s3://aluxian/sshkeys/aur ~/.ssh/aur
aws s3 cp --region eu-west-1 s3://aluxian/sshkeys/aur.pub ~/.ssh/aur.pub

chmod 600 ~/.ssh/aur
touch ~/.ssh/config

echo "Host aur.archlinux.org" >> ~/.ssh/config
echo "  IdentityFile ~/.ssh/aur" >> ~/.ssh/config
echo "  User aur" >> ~/.ssh/config
