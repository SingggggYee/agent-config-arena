#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

echo "==> Installing dependencies..."
npm install --silent 2>/dev/null

echo "==> Running test 20 times to verify reliability..."
for i in $(seq 1 20); do
  printf "  Run %2d/20... " "$i"
  node node_modules/vitest/vitest.mjs run --reporter=dot 2>&1 | tail -1
  if [ "${PIPESTATUS[0]}" -ne 0 ]; then
    echo "FAIL: Test failed on run $i"
    exit 1
  fi
done

echo "PASS: All 20 runs passed"
