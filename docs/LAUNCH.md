# Launch Copy — Ready to Post

## Hacker News (Show HN)

**Title:**
```
Show HN: Everyone shares their CLAUDE.md. Nobody tests them. We built the arena.
```

**Body:**
```
We built Agent Config Arena — an open-source benchmark that tests different CLAUDE.md / AGENTS.md configurations against each other on 8 real coding tasks.

The results were surprising:

- "Token-efficient" configs don't actually use fewer tokens. They win on speed (35% faster), not token count.
- Zero config (baseline) uses the fewest tokens. Adding instructions makes the model MORE verbose.
- "Workflow-heavy" (plan-first, TDD) has the LOWEST pass rate. More structure ≠ more correct.
- All 3 configs failed the data pipeline task equally.

We tested 3 official configs × 8 tasks (REST API, refactoring, bug fix, CLI tool, data pipeline, test coverage, TS migration, performance optimization) using Claude Code.

The arena is designed for community contribution — fork it, add your config, run the benchmark, submit your results.

https://github.com/SingggggYee/agent-config-arena

Tech: TypeScript, Node.js, supports Claude Code + Codex CLI runners.
```

---

## Reddit r/ClaudeAI

**Title:**
```
Agent Config Arena: I benchmarked 3 CLAUDE.md configs on 8 real coding tasks. The results surprised me.
```

**Body:**
```
I built an open-source tool that benchmarks different CLAUDE.md configurations against each other on real coding tasks.

## Results (3 configs × 8 tasks × Claude Code)

| Config | Pass Rate | Avg Tokens | Avg Time | Cost |
|--------|-----------|------------|----------|------|
| token-efficient | 88% | 208k | 73.7s | $0.28 |
| workflow-heavy | 86% | 205k | 90.0s | $0.31 |
| baseline (no config) | 88% | 201k | 112.9s | $0.33 |

## Surprising findings

1. **"Token-efficient" config doesn't actually use fewer tokens.** It wins on speed (35% faster than baseline), not token count.
2. **Zero config uses the fewest tokens.** Adding instructions makes Claude MORE verbose.
3. **"Workflow-heavy" (plan-first, TDD) has the lowest pass rate.** More structure doesn't help.
4. **All configs failed the data pipeline task.** The hardest tasks expose config limitations equally.

## Try it yourself

```
npx agent-config-arena compare --configs configs/official --runner claude
```

Or add your own config and submit a PR.

GitHub: https://github.com/SingggggYee/agent-config-arena

Open source, MIT licensed. Supports Claude Code and Codex CLI.
```

---

## Reddit r/ChatGPTCoding

**Title:**
```
I built an open benchmark arena for coding agent configs (CLAUDE.md, AGENTS.md). Supports Claude Code + Codex CLI.
```

**Body:** Same as r/ClaudeAI but emphasize Codex CLI support.

---

## Twitter/X Thread

**Tweet 1 (hook):**
```
Everyone shares their CLAUDE.md.

Nobody benchmarks them.

So I built an arena that does. Results were... not what I expected.

🧵
```

**Tweet 2 (results):**
```
Tested 3 config styles on 8 real coding tasks:

• token-efficient: 88% pass, 73s avg, $0.28
• workflow-heavy: 86% pass, 90s avg, $0.31  
• baseline (NO config): 88% pass, 113s avg, $0.33

The "token-efficient" config doesn't use fewer tokens. It just works faster.
```

**Tweet 3 (surprise):**
```
The biggest surprise?

Zero config (empty CLAUDE.md) uses the FEWEST tokens.

Adding instructions makes Claude MORE verbose, not less.

Your carefully crafted CLAUDE.md might be costing you more than doing nothing.
```

**Tweet 4 (CTA):**
```
Agent Config Arena is open source.

Fork it, add your config, run the benchmark.

Can your CLAUDE.md beat the leaderboard?

github.com/SingggggYee/agent-config-arena
```

---

## Dev.to Article

**Title:**
```
I Benchmarked 3 CLAUDE.md Configs on 8 Real Coding Tasks. Here's What Actually Works.
```

Use the HN body as the article intro, then expand with:
- Methodology section
- Per-task breakdown
- How to add your own config
- Link to repo

---

## Posting Schedule

| Day | Platform | Time (EST) |
|-----|----------|-----------|
| Day 0 (Wed) | HN Show HN | 9:00 AM |
| Day 0 | r/ClaudeAI | 11:00 AM |
| Day 0 | r/ChatGPTCoding | 12:00 PM |
| Day 1 (Thu) | Twitter/X thread | 10:00 AM |
| Day 1 | r/LocalLLaMA | 2:00 PM |
| Day 3 (Sat) | r/programming | 10:00 AM |
| Day 3 | Dev.to article | 10:00 AM |
| Day 7 | Follow-up with community results | - |
