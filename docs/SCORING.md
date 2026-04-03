# Scoring System

## Overview

Each config receives a composite score from 0 to 100, calculated as a weighted sum of four normalized metrics.

## Weights

| Metric | Weight | Rationale |
|--------|--------|-----------|
| Pass rate | 40% | A config that doesn't complete tasks is useless |
| Token efficiency | 25% | Direct cost impact |
| Time efficiency | 20% | Developer time matters |
| Cost efficiency | 15% | Real dollar impact (input + output tokens at published rates) |

## Normalization

For efficiency metrics (token, time, cost), scores are relative to the worst performer in the comparison set:

```
efficiency = 1 - (value / max_value_across_configs)
```

The best performer gets the highest efficiency score. If all configs have the same value, all get 0 (no differentiation).

## Aggregation

1. For each (config, task) pair with N runs, take the **median** of each metric
2. Average across all tasks to get per-config metrics
3. Apply weights to get final score

## Example

Given 3 configs on 2 tasks:

| Config | Pass Rate | Avg Tokens | Avg Time | Avg Cost |
|--------|-----------|------------|----------|----------|
| A | 100% | 10,000 | 30s | $0.15 |
| B | 50% | 5,000 | 20s | $0.08 |
| C | 100% | 15,000 | 45s | $0.22 |

Normalized efficiency (lower is better, so invert):
- Token: A=0.33, B=0.67, C=0.00
- Time: A=0.33, B=0.56, C=0.00
- Cost: A=0.32, B=0.64, C=0.00

Weighted score:
- A: (1.0 * 0.4) + (0.33 * 0.25) + (0.33 * 0.20) + (0.32 * 0.15) = 0.597 -> **60**
- B: (0.5 * 0.4) + (0.67 * 0.25) + (0.56 * 0.20) + (0.64 * 0.15) = 0.575 -> **58**
- C: (1.0 * 0.4) + (0.00 * 0.25) + (0.00 * 0.20) + (0.00 * 0.15) = 0.400 -> **40**

Config A wins despite using more tokens than B, because pass rate is weighted heavily.
