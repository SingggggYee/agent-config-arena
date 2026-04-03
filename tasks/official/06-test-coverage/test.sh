#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

# Install dependencies
npm install --silent 2>/dev/null

# Run tests with coverage
echo "=== Running tests with coverage ==="
node node_modules/vitest/vitest.mjs run --coverage --reporter=dot 2>&1

# Check coverage meets threshold
echo "=== Checking coverage thresholds ==="
node node_modules/vitest/vitest.mjs run --coverage --coverage.thresholds.lines=90 --coverage.thresholds.branches=80

if [ $? -eq 0 ]; then
  echo "PASS: All tests pass and coverage thresholds met"
else
  echo "FAIL: Tests failed or coverage thresholds not met"
  exit 1
fi
