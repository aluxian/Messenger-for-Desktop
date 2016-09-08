#!/bin/bash -ev

git config --global user.email "$GIT_USER_EMAIL"
git config --global user.name "$GIT_USER_NAME"
git config --global push.default simple

aws s3 cp --region eu-west-1 s3://aluxian/sshkeys/aur ~/.ssh/aur
aws s3 cp --region eu-west-1 s3://aluxian/sshkeys/aur.pub ~/.ssh/aur.pub

chmod 600 ~/.ssh/aur
touch ~/.ssh/config

echo "Host aur.archlinux.org" >> ~/.ssh/config
echo "  IdentityFile ~/.ssh/aur" >> ~/.ssh/config
echo "  User aur" >> ~/.ssh/config
