import type {
  RunResult,
  AggregatedResult,
  ScoringWeights,
} from "./types.js";
import { DEFAULT_WEIGHTS } from "./types.js";

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function aggregateResults(
  results: RunResult[],
  weights: ScoringWeights = DEFAULT_WEIGHTS,
): AggregatedResult[] {
  // Group by config+runner
  const groups = new Map<string, RunResult[]>();
  for (const r of results) {
    const key = `${r.configId}::${r.runner}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }

  const aggregated: AggregatedResult[] = [];

  for (const [key, runs] of groups) {
    const [configId, runner] = key.split("::");

    // Group by task, take median per task
    const byTask = new Map<string, RunResult[]>();
    for (const r of runs) {
      if (!byTask.has(r.taskId)) byTask.set(r.taskId, []);
      byTask.get(r.taskId)!.push(r);
    }

    const taskPassRates: number[] = [];
    const taskTokens: number[] = [];
    const taskTimes: number[] = [];
    const taskCosts: number[] = [];

    for (const [, taskRuns] of byTask) {
      const passCount = taskRuns.filter((r) => r.passed).length;
      taskPassRates.push(passCount / taskRuns.length);
      taskTokens.push(median(taskRuns.map((r) => r.tokensTotal)));
      taskTimes.push(median(taskRuns.map((r) => r.wallClockMs)));
      taskCosts.push(median(taskRuns.map((r) => r.costUsd)));
    }

    const passRate =
      taskPassRates.reduce((a, b) => a + b, 0) / taskPassRates.length;
    const avgTokens =
      taskTokens.reduce((a, b) => a + b, 0) / taskTokens.length;
    const avgTimeMs =
      taskTimes.reduce((a, b) => a + b, 0) / taskTimes.length;
    const avgCostUsd =
      taskCosts.reduce((a, b) => a + b, 0) / taskCosts.length;

    aggregated.push({
      configId,
      runner,
      passRate,
      avgTokens,
      avgTimeMs,
      avgCostUsd,
      score: 0, // Computed below
      taskResults: byTask,
    });
  }

  // Normalize and compute weighted scores
  if (aggregated.length > 0) {
    const maxTokens = Math.max(...aggregated.map((a) => a.avgTokens || 1));
    const maxTime = Math.max(...aggregated.map((a) => a.avgTimeMs || 1));
    const maxCost = Math.max(...aggregated.map((a) => a.avgCostUsd || 0.001));

    for (const a of aggregated) {
      const tokenEff = maxTokens > 0 ? 1 - a.avgTokens / maxTokens : 1;
      const timeEff = maxTime > 0 ? 1 - a.avgTimeMs / maxTime : 1;
      const costEff = maxCost > 0 ? 1 - a.avgCostUsd / maxCost : 1;

      a.score = Math.round(
        (a.passRate * weights.passRate +
          tokenEff * weights.tokenEfficiency +
          timeEff * weights.timeEfficiency +
          costEff * weights.costEfficiency) *
          100,
      );
    }
  }

  return aggregated.sort((a, b) => b.score - a.score);
}
