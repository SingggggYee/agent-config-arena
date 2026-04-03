#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

echo "==> Installing dependencies..."
npm install --silent 2>/dev/null

echo "==> Running tests..."
node node_modules/vitest/vitest.mjs run --reporter=verbose || { echo "FAIL: Tests did not pass"; exit 1; }

echo "==> Checking that src/utils.ts has been deleted..."
if [ -f src/utils.ts ]; then
  echo "FAIL: src/utils.ts still exists -- it should have been deleted"
  exit 1
fi

echo "==> Checking that new module files exist..."
for f in src/string-utils.ts src/date-utils.ts src/number-utils.ts; do
  if [ ! -f "$f" ]; then
    echo "FAIL: $f does not exist"
    exit 1
  fi
done

echo "PASS: All checks passed"
