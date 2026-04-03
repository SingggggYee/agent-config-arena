# Methodology

## Execution Model

For each (config, task) pair:

1. **Sandbox creation**: Copy `scaffold/` to a fresh temp directory
2. **Config injection**: Place config file as `CLAUDE.md` (or `AGENTS.md`) in sandbox root
3. **Agent invocation**: Run agent CLI with task prompt, capture stdout/stderr
4. **Verification**: Execute `test.sh` in sandbox, check exit code
5. **Metrics collection**: Parse token usage, measure wall-clock time, calculate cost
6. **Cleanup**: Remove sandbox

Each pair runs **3 times**. The **median** of each metric is used for scoring.

## Metrics

| Metric | Source | Unit |
|--------|--------|------|
| Pass/fail | test.sh exit code | boolean |
| Input tokens | API response metadata | count |
| Output tokens | API response metadata | count |
| Wall-clock time | Start-to-finish timing | milliseconds |
| Cost | Token count * published pricing | USD |

## Scoring

Weighted composite score (0-100):

| Component | Weight | Calculation |
|-----------|--------|-------------|
| Pass rate | 40% | Tasks passed / total tasks |
| Token efficiency | 25% | 1 - (tokens / max_tokens across configs) |
| Time efficiency | 20% | 1 - (time / max_time across configs) |
| Cost efficiency | 15% | 1 - (cost / max_cost across configs) |

Best performer per metric gets 100% for that component. Others scaled proportionally.

## Fairness Controls

- **Isolation**: Fresh sandbox per run, no state leakage
- **Determinism**: All test.sh scripts must be deterministic
- **Repetition**: 3 runs per pair, median used to reduce variance
- **Transparency**: All raw results stored as JSON in `results/`
- **Reproducibility**: Same task + config + runner should produce similar results
