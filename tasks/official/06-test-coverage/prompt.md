# Task 06: Add Test Coverage to Untested Module

Add a comprehensive test suite for the `math-expr` module in `src/math-expr.ts`.

## Module Overview

The module implements a math expression evaluator with three stages:
- **Tokenizer**: breaks a string into tokens (numbers, operators, parentheses)
- **Parser**: recursive descent parser producing an AST
- **Evaluator**: walks the AST and computes the result
- **Main export**: `evaluate(expr: string): number`

Supported features: `+`, `-`, `*`, `/`, parentheses, negative numbers, decimals.

Throws on: division by zero, malformed expressions, unbalanced parentheses.

## Requirements

1. Create `src/math-expr.test.ts` with comprehensive tests covering:
   - Basic arithmetic (`+`, `-`, `*`, `/`)
   - Operator precedence (`2 + 3 * 4` should be `14`, not `20`)
   - Parentheses (`(2 + 3) * 4` should be `20`)
   - Negative numbers (`-5 + 3` should be `-2`)
   - Decimal numbers (`1.5 * 2` should be `3`)
   - Division by zero (should throw)
   - Malformed expressions (should throw)
   - Unbalanced parentheses (should throw)
   - Edge cases: single number, deeply nested parens, whitespace handling

2. Achieve at least **90% line coverage** and **80% branch coverage**

## Run Tests

```bash
npx vitest run --coverage
```
