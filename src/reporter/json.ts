import type { AggregatedResult } from "../scoring/types.js";

export function generateResultsJson(results: AggregatedResult[]): string {
  const data = results.map((r) => ({
    configId: r.configId,
    runner: r.runner,
    passRate: r.passRate,
    avgTokens: r.avgTokens,
    avgTimeMs: r.avgTimeMs,
    avgCostUsd: r.avgCostUsd,
    score: r.score,
  }));

  return JSON.stringify(data, null, 2);
}
