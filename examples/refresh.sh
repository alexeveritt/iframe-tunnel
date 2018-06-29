#!/bin/bash

cd "$(dirname "$0")"
cd ..

echo "Compiling Typescript..."
tsc

echo "Building browser version..."
npm run browser-build

echo "Copying browser build into examples folder..."
cp -R browser/index.js examples/iframe-tunnel.js

echo "Starting Demo Server..."
npm run demo
