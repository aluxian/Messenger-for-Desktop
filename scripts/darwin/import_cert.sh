#!/bin/bash -ev

aws s3 cp --region eu-west-1 s3://aluxian/certificates/armacdev.cer armacdev.cer
aws s3 cp --region eu-west-1 s3://aluxian/certificates/armacdev.p12 armacdev.p12
security create-keychain -p $SIGN_DARWIN_KEYCHAIN_PASSWORD $SIGN_DARWIN_KEYCHAIN_NAME
security default-keychain -s $SIGN_DARWIN_KEYCHAIN_NAME
security unlock-keychain -p $SIGN_DARWIN_KEYCHAIN_PASSWORD $SIGN_DARWIN_KEYCHAIN_NAME
security set-keychain-settings -t 3600 -u $SIGN_DARWIN_KEYCHAIN_NAME
security import armacdev.cer -k $SIGN_DARWIN_KEYCHAIN_NAME -T /usr/bin/codesign
security import armacdev.p12 -P $DEV_ID_APP_PASSWORD -k $SIGN_DARWIN_KEYCHAIN_NAME -T /usr/bin/codesign
