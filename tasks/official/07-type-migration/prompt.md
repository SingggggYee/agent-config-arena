# JS to TypeScript Migration

Migrate this Express middleware library from JavaScript to TypeScript.

## Requirements

1. **Convert all `.js` files in `src/` to `.ts`** with strict types. No `any` type is allowed anywhere in source files.
2. **Convert JSDoc type annotations to proper TypeScript interfaces/types.** All `@typedef` blocks should become exported interfaces.
3. **Add a `tsconfig.json`** with `strict: true` enabled.
4. **Update `package.json`** to include TypeScript as a dev dependency and add appropriate build/type-check scripts.
5. **All existing tests must pass** after migration (`npx vitest run`).
6. **The built output must maintain the same public API surface** - all exports from `src/index.js` must remain available from `src/index.ts`.
7. **Remove the original `.js` source files** after migration (the `src/` directory should only contain `.ts` files).

## What NOT to change

- Do not modify the test files (they should work as-is against the migrated code).
- Do not change the middleware behavior or API signatures.
- Do not add runtime dependencies.

## Hints

- The middlewares use Express types - you'll need `@types/express`.
- The `keyGenerator` callback in the rate limiter takes a Request and returns a string.
- The logger's `format` function receives request/response info and returns a formatted string.
