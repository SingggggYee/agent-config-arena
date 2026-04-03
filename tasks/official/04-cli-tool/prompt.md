# CLI Argument Parser

## Objective

Build a CLI tool in `src/cli.ts` that reads a JSON file and extracts a value using a dot-notation path expression.

## Usage

```
npx tsx src/cli.ts <file> <path> [--compact] [--help]
```

### Examples

```bash
# Given sample.json: {"data": {"users": [{"name": "Alice"}]}}
npx tsx src/cli.ts sample.json name              # "test"
npx tsx src/cli.ts sample.json data.users[0].name # "Alice"
npx tsx src/cli.ts sample.json data.users         # Pretty-printed array
npx tsx src/cli.ts sample.json data.users --compact # Minified JSON array
npx tsx src/cli.ts sample.json --help             # Show usage
```

## Requirements

1. **Read a JSON file** from the path given as the first argument.
2. **Resolve a dot-notation path** given as the second argument. Support:
   - Simple keys: `name`
   - Nested keys: `data.name`
   - Array indices: `users[0]`
   - Mixed deep paths: `data.users[0].name`
3. **Output the resolved value** to stdout:
   - Strings are printed without quotes.
   - Objects and arrays are pretty-printed (2-space indent) by default.
   - With `--compact`, objects and arrays are printed as minified JSON.
4. **`--help`** or no arguments: print a usage message to stdout and exit with code 0.
5. **Error handling**:
   - If the file does not exist, print an error to stderr and exit with code 1.
   - If the path does not resolve to a value, print `undefined` to stdout.
6. **No external libraries** for path resolution. Implement the dot-notation parser yourself. You may use `fs` and `process` from Node.js stdlib.

## Constraints

- The implementation must be in `src/cli.ts`.
- Do not install additional npm packages beyond what is in `package.json`.
