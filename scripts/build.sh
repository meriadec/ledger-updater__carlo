#!/bin/bash

rm -rf dist
mkdir dist
cp src/{favicon.ico,main/*} dist
sed -i 's/http:\/\/localhost:1234/index.html/g' dist/main.js
parcel build src/index.html
