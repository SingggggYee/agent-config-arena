#!/bin/bash
set -e
cd "$(dirname "$0")"

# Install deps if needed
[ -d node_modules ] || npm install --silent 2>/dev/null

# Run the built-in test suite
node --test test/*.test.js 2>&1

# Verify PATCH endpoint exists in source
grep -q "patch\|PATCH" src/app.js || { echo "FAIL: No PATCH endpoint found in src/app.js"; exit 1; }
