#!/bin/bash

PATH=./node_modules/.bin:$PATH

# launch parcel server
parcel src/index.html &
PARCEL_PID=$!

# wait for parcel server
while ! curl --connect-timeout 0.5 http://localhost:1234 &>/dev/null ; do sleep 0.1;  done

node src/main/main.js

kill -9 $PARCEL_PID
