import { describe, it, expect } from "vitest";
import { aggregateResults } from "./index.js";
import type { RunResult } from "./types.js";

function makeResult(
  overrides: Partial<RunResult> = {},
): RunResult {
  return {
    configId: "test-config",
    taskId: "test-task",
    runner: "claude",
    runNumber: 1,
    timestamp: new Date().toISOString(),
    passed: true,
    tokensInput: 1000,
    tokensOutput: 500,
    tokensTotal: 1500,
    wallClockMs: 5000,
    costUsd: 0.01,
    exitCode: 0,
    ...overrides,
  };
}

describe("aggregateResults", () => {
  it("returns empty array for no results", () => {
    expect(aggregateResults([])).toEqual([]);
  });

  it("aggregates single config results", () => {
    const results = [
      makeResult({ runNumber: 1 }),
      makeResult({ runNumber: 2 }),
      makeResult({ runNumber: 3 }),
    ];

    const agg = aggregateResults(results);
    expect(agg).toHaveLength(1);
    expect(agg[0].configId).toBe("test-config");
    expect(agg[0].passRate).toBe(1);
    expect(agg[0].avgTokens).toBe(1500);
  });

  it("ranks configs by score (higher pass rate wins)", () => {
    const results = [
      makeResult({ configId: "good", passed: true, tokensTotal: 1000, wallClockMs: 3000, costUsd: 0.005 }),
      makeResult({ configId: "bad", passed: false, tokensTotal: 5000, wallClockMs: 10000, costUsd: 0.05 }),
    ];

    const agg = aggregateResults(results);
    expect(agg[0].configId).toBe("good");
    expect(agg[0].score).toBeGreaterThan(agg[1].score);
  });

  it("handles multiple tasks per config", () => {
    const results = [
      makeResult({ taskId: "task-1", passed: true }),
      makeResult({ taskId: "task-2", passed: false }),
    ];

    const agg = aggregateResults(results);
    expect(agg[0].passRate).toBe(0.5);
  });
});
