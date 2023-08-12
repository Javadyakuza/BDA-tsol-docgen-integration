#!/usr/bin/env bash

set -o errexit

OUTDIR="$(node -p 'require("./src/tsol-docgen-config.js").outputDir')"

if [ ! -d node_modules ]; then
  npm ci
fi  

rm -rf "$OUTDIR"

node ./src/tsol-docgen/scripts/gen-docs.js

node ./src/tsol-docgen/scripts/gen-nav.js "$OUTDIR" > "$OUTDIR/../nav.adoc"

