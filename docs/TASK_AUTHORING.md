# Task Authoring Guide

## Directory Structure

```
tasks/community/your-task/
  meta.json       # Required: task metadata
  prompt.md       # Required: instructions for the agent
  test.sh         # Required: verification script
  scaffold/       # Required: starter code
    package.json
    src/
    test/         # Optional: existing tests
```

## meta.json Schema

```json
{
  "id": "your-task-id",
  "name": "Human-Readable Task Name",
  "difficulty": "easy|medium|hard",
  "category": "backend|frontend|refactoring|debugging|testing|migration|optimization|greenfield",
  "language": "typescript|javascript",
  "timeoutSeconds": 120,
  "expectedTokenRange": [5000, 25000],
  "tags": ["express", "testing", "async"]
}
```

## prompt.md Guidelines

- Write clear, unambiguous instructions
- Specify exact requirements (what to implement, what constraints to follow)
- Include acceptance criteria
- Don't prescribe implementation details -- let the agent choose its approach
- The prompt is given to the agent as-is

## test.sh Guidelines

- Must exit 0 on pass, non-zero on fail
- Should be self-contained (install deps if needed)
- Must be deterministic
- Timeout should match `meta.json` timeoutSeconds
- Can run test suites, check file existence, diff outputs, run benchmarks

Example:
```bash
#!/bin/bash
set -e
cd "$(dirname "$0")"
[ -d node_modules ] || npm install --silent 2>/dev/null
npx vitest run
```

## Scaffold Guidelines

- Must contain realistic, working starter code
- Should NOT be an empty project
- Include existing tests if the task is about extending functionality
- Include enough context that the agent understands the codebase
- Keep scaffold small (< 500 lines total) to stay within agent context limits

## Validation

```bash
node dist/index.js validate-task tasks/community/your-task/
```

This checks for required files, valid meta.json, and scaffold existence.
