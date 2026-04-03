#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

echo "==> Installing dependencies..."
npm install --silent 2>/dev/null

echo "==> Running tests..."
node node_modules/vitest/vitest.mjs run --reporter=verbose || { echo "FAIL: Tests did not pass"; exit 1; }

echo "PASS: All checks passed"
