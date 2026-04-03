#!/bin/bash
set -e

cd "$(dirname "$0")"

# Install dependencies
npm install --silent 2>/dev/null

# Must compile with no errors
node node_modules/typescript/bin/tsc --noEmit || { echo "FAIL: TypeScript compilation failed"; exit 1; }

# Must have no 'any' in source files
if grep -rE ": any|<any>|as any" src/*.ts 2>/dev/null | grep -v node_modules | grep -v ".d.ts"; then
  echo "FAIL: Found 'any' type in source files"
  exit 1
fi

# Tests must pass
node node_modules/vitest/vitest.mjs run || { echo "FAIL: Tests failed"; exit 1; }

# Original JS files should be gone or replaced by TS
if ls src/*.js 2>/dev/null; then
  echo "FAIL: JS files still exist in src/"
  exit 1
fi

# All original exports must exist in index.ts
if [ ! -f src/index.ts ]; then
  echo "FAIL: src/index.ts not found"
  exit 1
fi

# tsconfig.json must exist
if [ ! -f tsconfig.json ]; then
  echo "FAIL: tsconfig.json not found"
  exit 1
fi

echo "PASS"
