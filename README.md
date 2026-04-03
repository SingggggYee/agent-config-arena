# Agent Config Arena

> Everyone shares their CLAUDE.md. Nobody benchmarks them. Until now.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## Results: 3 Configs × 8 Tasks × Claude Code

| Config | Pass Rate | Avg Tokens | Avg Time | Avg Cost | Score |
|--------|-----------|------------|----------|----------|-------|
| **token-efficient** | **88%** | 208k | **73.7s** | **$0.28** | **44** |
| workflow-heavy | 86% | 205k | 90.0s | $0.31 | 40 |
| baseline (no config) | 88% | 201k | 112.9s | $0.33 | 36 |

> Tested on 8 real coding tasks (REST API, refactoring, bug fix, CLI tool, data pipeline, test coverage, TS migration, performance optimization). Full results in [LEADERBOARD.md](LEADERBOARD.md).

### Surprising findings

- **"Token-efficient" config is fastest and cheapest, but doesn't actually use fewer tokens.** It wins on speed (35% faster than baseline) and cost, not token count.
- **Zero config (baseline) uses the fewest tokens.** Adding instructions makes the model *more* verbose, not less.
- **"Workflow-heavy" (plan-first, TDD) has the lowest pass rate.** More structure doesn't mean more correct.
- **All 3 configs failed the data pipeline task.** The hardest tasks expose config limitations equally.
- **The biggest gap is speed, not accuracy.** Pass rates are within 2%, but time ranges from 73s to 113s.

---

## What is this?

A neutral, open-source benchmark that tests different coding agent configurations on the **same real coding tasks** -- then publishes the results.

**Not a model benchmark.** SWE-bench tests models. We test *configs*.
**Not a tool collection.** awesome-claude-code collects tools. We *evaluate* them.
**Not a single config.** claude-token-efficient ships one config. We pit configs *against each other*.

## Quick Start

```bash
# Compare all official configs on all tasks
npx agent-config-arena compare --configs configs/official --runner claude

# Or benchmark your own config
npx agent-config-arena run --config your-config.md --runner claude

# Generate leaderboard
npx agent-config-arena leaderboard
```

## Add Your Own Config

1. Create `configs/community/your-config.md`
2. Run: `npx agent-config-arena run --config configs/community/your-config.md`
3. Submit a PR with your config + results

Can your CLAUDE.md beat the leaderboard? [Find out.](CONTRIBUTING.md)

See [LEADERBOARD.md](LEADERBOARD.md) for full results.

## Tasks (v1)

8 real-world coding tasks, from easy to hard:

| # | Task | Difficulty | What it tests |
|---|------|-----------|---------------|
| 01 | REST API PATCH Endpoint | Easy | Add endpoint + validation + tests |
| 02 | Extract & Refactor Module | Easy | Split file, update imports, keep tests green |
| 03 | Fix Async Race Condition | Medium | Find and fix concurrency bug |
| 04 | CLI Argument Parser | Medium | Build tool from scratch |
| 05 | Data Pipeline Transform | Medium | CSV parsing, dedup, normalization |
| 06 | Add Test Coverage | Medium | Write tests to hit 90% coverage |
| 07 | JS to TypeScript Migration | Hard | Migrate 5 files, strict types, no `any` |
| 08 | Performance Optimization | Hard | 20x speedup on search algorithm |

All tasks have automated verification (test suites, benchmarks, or file checks). No subjective grading.

## Configs

Three official configs ship with the arena:

| Config | Strategy | Philosophy |
|--------|----------|------------|
| `baseline` | No instructions | Control group -- what happens with zero config? |
| `token-efficient` | Minimize output | No preamble, no summary, stop when tests pass |
| `workflow-heavy` | Plan-first, TDD | Read first, plan, implement in increments, review |

## Supported Runners

| Runner | Status | Config File |
|--------|--------|-------------|
| Claude Code | Supported | CLAUDE.md |
| Codex CLI | Supported | AGENTS.md |
| OpenCode | Planned (v2) | - |

## Add Your Own Config

1. Create `configs/community/your-config.md` with optional YAML frontmatter:
   ```yaml
   ---
   name: My Config
   author: your-github-handle
   description: One-line description
   ---
   ```
2. Run: `npx agent-config-arena run --config configs/community/your-config.md`
3. Submit a PR with your config + results

## Add Your Own Task

1. Create a directory in `tasks/community/your-task/` with:
   - `meta.json` -- task metadata
   - `prompt.md` -- natural language instructions for the agent
   - `scaffold/` -- starter code the agent works in
   - `test.sh` -- verification script (exit 0 = pass)
2. Validate: `npx agent-config-arena validate-task tasks/community/your-task/`
3. Submit a PR

See [docs/TASK_AUTHORING.md](docs/TASK_AUTHORING.md) for the full spec.

## Metrics

| Metric | Weight | What it measures |
|--------|--------|-----------------|
| Pass rate | 40% | Does the config actually get the job done? |
| Token efficiency | 25% | How many tokens to get there? |
| Time to green | 20% | How fast? |
| Cost | 15% | Real dollar impact |

Each config runs **3 times per task** (median used). All runs in **isolated sandboxes**. Raw results stored as JSON in `results/`.

## Methodology

- Isolated sandbox per run (fresh copy of scaffold)
- Config file placed as CLAUDE.md or AGENTS.md in sandbox root
- Agent invoked with task prompt via CLI
- test.sh runs in sandbox to verify pass/fail
- Token counts from API response metadata
- Wall-clock timing from prompt to test pass
- Cost from published API pricing
- All raw results published as JSON

## Tiers

- **Official** (`configs/official/`, `tasks/official/`) -- Maintained by the project, tested on every release
- **Community** (`configs/community/`, `tasks/community/`) -- Submitted via PR, tested by contributors

## FAQ

**How is this different from SWE-bench?**
SWE-bench benchmarks *which model* solves GitHub issues best. We benchmark *which configuration of the same model* performs best. Orthogonal axes.

**How is this different from everything-claude-code?**
ECC is a toolkit (skills, hooks, agents). We are a testing ground. You can benchmark an ECC config here.

**How is this different from claude-token-efficient?**
CTE ships one optimized CLAUDE.md. We provide the arena where CTE -- and any other config -- can be tested on a broader, independent task set.

**Can I benchmark Cursor / Windsurf / Aider configs?**
v1 supports Claude Code and Codex CLI. The runner adapter interface is designed for extension. Community adapters welcome.

**How do I know the benchmark is fair?**
Isolated sandboxes, deterministic test suites, median of 3 runs, all raw results published as JSON. The methodology is documented and the code is open source.

## CLI Reference

```
agent-config-arena <command> [options]

Commands:
  list-tasks              List available benchmark tasks
  list-configs            List available configs
  validate-task <path>    Validate a task definition
  run                     Run a single config against tasks
  compare                 Compare multiple configs
  leaderboard             Generate leaderboard from results

Run options:
  -c, --config <path>     Config file path
  -r, --runner <name>     Runner: claude | codex (default: claude)
  -t, --tasks <path>      Tasks directory (default: tasks/official)
  --task <id>             Run specific task only
  -n, --runs <n>          Runs per task (default: 3)
  -o, --output <path>     Results directory (default: results)
  -v, --verbose           Show agent output in real-time
```

## Roadmap

- [x] v1: Config arena (Claude Code + Codex CLI, 8 tasks, 3 configs)
- [ ] v2: Multi-agent comparison (OpenCode, Cursor, Windsurf)
- [ ] v3: Community leaderboard site, CI integration, task submission portal

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
