#!/bin/bash

cd "$(dirname "$0")"
cd ..

echo "Compiling Typescript..."
tsc

echo "Building browser version..."
npm run browser-build

echo "Copying browser build into examples folder..."
cp -R browser/iframe-tunnel.js examples

echo "Starting Demo Server..."
node examples/demo-server.js
