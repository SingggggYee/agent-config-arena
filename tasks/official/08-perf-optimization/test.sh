#!/bin/bash
set -e

cd "$(dirname "$0")"

# Install dependencies
npm install --silent 2>/dev/null

# Tests must pass
node node_modules/vitest/vitest.mjs run || { echo "FAIL: Tests failed"; exit 1; }

# Benchmark must meet target
node --import tsx/esm src/benchmark.ts || { echo "FAIL: Benchmark target not met"; exit 1; }

echo "PASS"
