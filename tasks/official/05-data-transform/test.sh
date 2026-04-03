#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

# Install dependencies
npm install --silent 2>/dev/null

# Run the transform
node --import tsx/esm src/transform.ts data/ output.csv

# Compare output against expected (sorted to handle any ordering issues)
if diff <(sort output.csv) <(sort expected-output.csv); then
  echo "PASS: Output matches expected"
else
  echo "FAIL: Output does not match expected"
  echo "--- Expected ---"
  cat expected-output.csv
  echo "--- Got ---"
  cat output.csv
  exit 1
fi
