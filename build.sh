#!/bin/bash
rm -rf dist
cp resources/prod/config.json src/assets/config.json
cp resources/prod/config.json config.json
ng build --prod
cp resources/prod/package.json dist
cp bundle-back.js dist
cp calories.json dist
rm *.gz
tar -zcvf dist.tar.gz dist
cp resources/dev/config.json src/assets/config.json
cp resources/dev/config.json config.json
