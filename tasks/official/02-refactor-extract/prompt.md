# Extract & Refactor Module

## Objective

Refactor the monolithic `src/utils.ts` file into three separate, well-organized modules:

- `src/string-utils.ts` -- String manipulation utilities
- `src/date-utils.ts` -- Date manipulation utilities
- `src/number-utils.ts` -- Number manipulation utilities

## Requirements

1. **Split `src/utils.ts`** into the three modules listed above. Each function should go into the appropriate module based on its category.

2. **Update `src/index.ts`** to import and re-export all functions from the three new modules instead of from `utils.ts`.

3. **Delete `src/utils.ts`** after the refactor is complete. The original file must no longer exist.

4. **All existing tests must continue to pass.** The test file imports from `../src/utils` -- you may update the test imports to point at the correct new modules, or ensure the re-exports through `index.ts` keep things working. Either approach is acceptable as long as `npx vitest run` passes.

## Constraints

- Do not change any function signatures or behavior.
- Do not add or remove any functions.
- Do not modify test assertions.
