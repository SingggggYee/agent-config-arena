# Contributing to Agent Config Arena

Thanks for your interest! Here's how to contribute.

## Submit a Config

1. Fork this repo
2. Create `configs/community/your-config-name.md`
3. Add YAML frontmatter:
   ```yaml
   ---
   name: Your Config Name
   author: your-github-handle
   description: One-line description of your approach
   ---
   ```
4. Run the benchmark: `node dist/index.js run --config configs/community/your-config-name.md`
5. Include your results in the PR description
6. Submit a PR

## Submit a Task

1. Fork this repo
2. Create a directory: `tasks/community/your-task-name/`
3. Include these files:
   - `meta.json` -- see [docs/TASK_AUTHORING.md](docs/TASK_AUTHORING.md) for schema
   - `prompt.md` -- natural language task description
   - `scaffold/` -- starter code (must be non-empty)
   - `test.sh` -- verification script (exit 0 = pass, exit 1 = fail)
4. Validate: `node dist/index.js validate-task tasks/community/your-task-name/`
5. Submit a PR

## Task Quality Guidelines

- Tasks should be **automatically verifiable** (no subjective grading)
- Tasks should take an agent **30 seconds to 5 minutes** to complete
- Scaffold should contain **realistic existing code**, not an empty project
- test.sh should be **deterministic** (same input = same result every time)
- Tasks should test **config effectiveness**, not raw model intelligence

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Type check
pnpm lint

# Run tests
pnpm test

# Run CLI in development
pnpm build && node dist/index.js list-tasks
```

## Code Style

- TypeScript strict mode
- No `any` types
- Prefer `node:` protocol for built-in imports
- Keep functions focused and small

## PR Guidelines

- One config or one task per PR (don't bundle)
- Include benchmark results in PR description if submitting a config
- Link to relevant issues if applicable
